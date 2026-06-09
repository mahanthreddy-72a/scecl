require('dotenv').config();

const pool = require('../db');
const migration001 = require('./001_init');

async function runMigrations() {
  try {
    console.log('Running migrations...');

    await migration001.up(pool);

    console.log('✓ All migrations completed successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    await pool.end();
    process.exit(1);
  }
}

runMigrations();
