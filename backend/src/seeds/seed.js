const db = require('../db');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    console.log('Seeding database...');

    // Clear existing data
    db.exec('DELETE FROM activity_logs; DELETE FROM votes; DELETE FROM candidates; DELETE FROM students; DELETE FROM admins;');

    // Seed admin accounts
    const adminPassword = await bcrypt.hash('admin123', 10);
    db.prepare(`
      INSERT INTO admins (username, password_hash, email)
      VALUES (?, ?, ?)
    `).run('admin', adminPassword, 'admin@school.edu');

    // Seed students
    const houses = ['Spartans', 'Vikings', 'Knights', 'Samurais'];
    const classes = ['10A', '10B', '10C', '11A', '11B', '11C', '12A', '12B', '12C'];
    const names = [
      'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Edward Norton',
      'Fiona Apple', 'George Harris', 'Hannah Montana', 'Ivan Petrov', 'Jessica Jones'
    ];

    const studentStmt = db.prepare(`
      INSERT INTO students (scs_no, name, class, house)
      VALUES (?, ?, ?, ?)
    `);

    for (let i = 1001; i <= 1030; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const house = houses[Math.floor(Math.random() * houses.length)];
      const cls = classes[Math.floor(Math.random() * classes.length)];
      studentStmt.run(`${i}`, `${name} ${i}`, cls, house);
    }

    // Seed candidates for common positions
    const commonPositions = [
      { name: 'Arun Kumar', position: 'Head Boy' },
      { name: 'Priya Singh', position: 'Head Girl' },
      { name: 'Rohan Patel', position: 'Sports Captain' },
      { name: 'Zara Khan', position: 'Cultural Secretary' }
    ];

    const candidateStmt = db.prepare(`
      INSERT INTO candidates (name, position, house)
      VALUES (?, ?, ?)
    `);

    commonPositions.forEach(c => {
      candidateStmt.run(c.name, c.position, null);
    });

    // Seed house-specific candidates
    const housePositions = ['House Captain', 'House Vice Captain'];
    houses.forEach(house => {
      housePositions.forEach(position => {
        candidateStmt.run(`${house} ${position} Candidate`, position, house);
      });
    });

    console.log('✓ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
