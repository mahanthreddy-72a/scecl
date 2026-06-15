require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('../backend/src/db');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - mount at root for Vercel
app.use('/auth', require('../backend/src/routes/auth'));
app.use('/voting', require('../backend/src/routes/voting'));
app.use('/candidates', require('../backend/src/routes/candidates'));
app.use('/students', require('../backend/src/routes/students'));
app.use('/dashboard', require('../backend/src/routes/dashboard'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend running on Vercel' });
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Path not found:', req.path, 'Method:', req.method);
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Server error' });
});

module.exports = app;
