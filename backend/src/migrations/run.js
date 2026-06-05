const db = require('../db');
const migration001 = require('./001_init');

try {
  console.log('Running migrations...');

  migration001.up(db);

  console.log('✓ All migrations completed successfully');
  process.exit(0);
} catch (error) {
  console.error('✗ Migration failed:', error.message);
  process.exit(1);
}
