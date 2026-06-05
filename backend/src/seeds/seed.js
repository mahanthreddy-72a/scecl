const pool = require('../db');
const bcrypt = require('bcrypt');

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Seeding database...');

    // Clear existing data
    await client.query('DELETE FROM activity_logs');
    await client.query('DELETE FROM votes');
    await client.query('DELETE FROM candidates');
    await client.query('DELETE FROM students');
    await client.query('DELETE FROM admins');

    // Seed admin accounts
    const adminPassword = await bcrypt.hash('admin123', 10);
    await client.query(
      `INSERT INTO admins (username, password_hash, email) VALUES ($1, $2, $3)`,
      ['admin', adminPassword, 'admin@school.edu']
    );

    // Seed students
    const houses = ['Spartans', 'Vikings', 'Knights', 'Samurais'];
    const classes = ['10A', '10B', '10C', '11A', '11B', '11C', '12A', '12B', '12C'];
    const names = [
      'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Edward Norton',
      'Fiona Apple', 'George Harris', 'Hannah Montana', 'Ivan Petrov', 'Jessica Jones'
    ];

    for (let i = 1001; i <= 1030; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const house = houses[Math.floor(Math.random() * houses.length)];
      const cls = classes[Math.floor(Math.random() * classes.length)];
      await client.query(
        `INSERT INTO students (scs_no, name, class, house) VALUES ($1, $2, $3, $4)`,
        [`${i}`, `${name} ${i}`, cls, house]
      );
    }

    // Seed candidates for common positions
    const commonPositions = [
      { name: 'Arun Kumar', position: 'Head Boy' },
      { name: 'Priya Singh', position: 'Head Girl' },
      { name: 'Rohan Patel', position: 'Sports Captain' },
      { name: 'Zara Khan', position: 'Cultural Secretary' }
    ];

    for (const candidate of commonPositions) {
      await client.query(
        `INSERT INTO candidates (name, position, house) VALUES ($1, $2, $3)`,
        [candidate.name, candidate.position, null]
      );
    }

    // Seed house-specific candidates
    const housePositions = ['House Captain', 'House Vice Captain'];
    for (const house of houses) {
      for (const position of housePositions) {
        await client.query(
          `INSERT INTO candidates (name, position, house) VALUES ($1, $2, $3)`,
          [`${house} ${position} Candidate`, position, house]
        );
      }
    }

    console.log('✓ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
