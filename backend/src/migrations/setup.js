const { Client } = require('pg');

const adminClient = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: 'postgres'
});

async function createDatabase() {
  try {
    await adminClient.connect();

    const dbName = process.env.DB_NAME || 'elections';

    // Check if database exists
    const res = await adminClient.query(
      `SELECT datname FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rows.length === 0) {
      console.log(`Creating database ${dbName}...`);
      await adminClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✓ Database ${dbName} created`);
    } else {
      console.log(`✓ Database ${dbName} already exists`);
    }

    await adminClient.end();
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

createDatabase();
