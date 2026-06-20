require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const rateLimit = require('express-rate-limit');
const path = require('path');
const pool = require('./db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const votingRoutes = require('./routes/voting');
const candidatesRoutes = require('./routes/candidates');
const studentsRoutes = require('./routes/students');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Render
app.set('trust proxy', 1);

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', '-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-Powered-By', ''); // Hide Express version
  next();
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS - restrict to your domain only
app.use(cors({
  origin: [process.env.CORS_ORIGIN || 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  allowedHeaders: ['Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Session management (in-memory store - no DB connections wasted!)
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'change-this-secret',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    Age: 2 * 60 * 60 * 1000
  }
}));

// Static files BEFORE rate limiting (images shouldn't be rate limited!)
const uploadsPath = path.join(__dirname, '..', '..', 'backend', 'uploads');
console.log('📁 Serving static files from:', uploadsPath);
console.log('📁 Files in directory:', require('fs').readdirSync(uploadsPath));
app.use('/uploads', express.static(uploadsPath, { dotfiles: 'allow' }));

// General rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false
});

// DISABLE rate limiting for status checks (they happen on every page load)
const noRateLimit = (req, res, next) => next();

// Strict rate limiting for voting
const votingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500, // Max 3 vote attempts per hour
  message: 'Too many voting attempts',
  skipSuccessfulRequests: false
});

// Strict rate limiting for login only
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Too many login attempts. Please wait and try again.',
  skipSuccessfulRequests: true,
  skip: (req) => req.path === '/student/status' || req.path === '/admin/status'
});

app.use(limiter);

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/voting', votingRoutes); // No rate limit - DB prevents double voting
app.use('/api/candidates', candidatesRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve frontend static files
const fs = require('fs');

// Try multiple possible paths for frontend dist
const possiblePaths = [
  path.join(__dirname, '../../frontend/dist'),
  path.join(__dirname, '../../../frontend/dist'),
  path.join(process.cwd(), 'frontend/dist'),
  '/opt/render/project/src/frontend/dist' // Render default
];

let frontendPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    frontendPath = p;
    console.log('✓ Found frontend at:', p);
    break;
  }
}

if (!frontendPath) {
  console.log('⚠️ Frontend dist not found in:', possiblePaths);
  frontendPath = possiblePaths[0]; // Use first as fallback
}

console.log('📁 Using frontend path:', frontendPath);
console.log('📂 Files in dist:', fs.existsSync(frontendPath) ? fs.readdirSync(frontendPath) : 'FOLDER NOT FOUND');

app.use(express.static(frontendPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return res.status(404).json({ error: 'Frontend not built. Check deployment logs.' });
  }
  res.sendFile(indexPath);
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Database: ${process.env.DB_NAME || 'elections'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});
