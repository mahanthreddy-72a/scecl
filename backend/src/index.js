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

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
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

// Session management
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Static files BEFORE rate limiting (images shouldn't be rate limited!)
const uploadsPath = path.join(__dirname, '..', '..', 'backend', 'uploads');
console.log('📁 Serving static files from:', uploadsPath);
console.log('📁 Files in directory:', require('fs').readdirSync(uploadsPath));
app.use('/uploads', express.static(uploadsPath, { dotfiles: 'allow' }));

// General rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 10000,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiting for voting
const votingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 attempts per hour
  message: 'Too many voting attempts',
  skipSuccessfulRequests: false
});

// Strict rate limiting for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 login attempts
  message: 'Too many login attempts',
  skipSuccessfulRequests: false
});

app.use(limiter);

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/voting', votingLimiter, votingRoutes);
app.use('/api/candidates', candidatesRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve frontend static files
const frontendPath = path.join(__dirname, '../../frontend/dist');
console.log('📁 Frontend path:', frontendPath);
const fs = require('fs');
if (fs.existsSync(frontendPath)) {
  console.log('✓ Frontend dist folder exists');
  console.log('📂 Files:', fs.readdirSync(frontendPath));
} else {
  console.log('❌ Frontend dist folder NOT FOUND!');
}
app.use(express.static(frontendPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  console.log('📄 Serving index.html from:', indexPath);
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
