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

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS
app.use(cors({
  origin: [process.env.CORS_ORIGIN || 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/voting', votingRoutes);
app.use('/api/candidates', candidatesRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
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
