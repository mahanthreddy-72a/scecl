module.exports = {
  up: (db) => {
    // Students table
    db.exec(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scs_no TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        class TEXT NOT NULL,
        house TEXT NOT NULL CHECK(house IN ('Spartans', 'Vikings', 'Knights', 'Samurais')),
        has_voted INTEGER DEFAULT 0,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_scs_no ON students(scs_no);
      CREATE INDEX idx_has_voted ON students(has_voted);
    `);

    // Admin accounts table
    db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Candidates table
    db.exec(`
      CREATE TABLE IF NOT EXISTS candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        house TEXT,
        image_path TEXT,
        vote_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_position ON candidates(position);
      CREATE INDEX idx_house ON candidates(house);
    `);

    // Votes table
    db.exec(`
      CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        candidate_id INTEGER NOT NULL,
        position TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
      );
      CREATE INDEX idx_student_id ON votes(student_id);
      CREATE INDEX idx_candidate_id ON votes(candidate_id);
      CREATE INDEX idx_position ON votes(position);
    `);

    // Audit logs table
    db.exec(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        entity_type TEXT,
        entity_id INTEGER,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_action ON audit_logs(action);
      CREATE INDEX idx_created_at ON audit_logs(created_at);
    `);

    // Activity tracking table
    db.exec(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('logged_in', 'viewing_ballot', 'voting', 'submitted')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      );
      CREATE INDEX idx_student_id ON activity_logs(student_id);
      CREATE INDEX idx_created_at ON activity_logs(created_at);
    `);
  },

  down: (db) => {
    db.exec(`
      DROP TABLE IF EXISTS activity_logs;
      DROP TABLE IF EXISTS audit_logs;
      DROP TABLE IF EXISTS votes;
      DROP TABLE IF EXISTS candidates;
      DROP TABLE IF EXISTS admins;
      DROP TABLE IF EXISTS students;
    `);
  }
};
