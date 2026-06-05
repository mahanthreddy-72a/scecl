const migration = {
  up: async (pool) => {
    const client = await pool.connect();
    try {
      // Students table
      await client.query(`
        CREATE TABLE IF NOT EXISTS students (
          id SERIAL PRIMARY KEY,
          scs_no VARCHAR(255) UNIQUE NOT NULL CHECK(scs_no ~ '^[0-9]{4,}$'),
          name VARCHAR(255) NOT NULL,
          class VARCHAR(50) NOT NULL,
          house VARCHAR(50) NOT NULL CHECK(house IN ('Spartans', 'Vikings', 'Knights', 'Samurais')),
          has_voted BOOLEAN DEFAULT FALSE,
          last_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_students_scs_no ON students(scs_no);
        CREATE INDEX IF NOT EXISTS idx_students_has_voted ON students(has_voted);
      `);

      // Admin accounts table
      await client.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Candidates table
      await client.query(`
        CREATE TABLE IF NOT EXISTS candidates (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          position VARCHAR(100) NOT NULL,
          house VARCHAR(50),
          image_path VARCHAR(500),
          vote_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_candidates_position ON candidates(position);
        CREATE INDEX IF NOT EXISTS idx_candidates_house ON candidates(house);
      `);

      // Votes table
      await client.query(`
        CREATE TABLE IF NOT EXISTS votes (
          id SERIAL PRIMARY KEY,
          student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
          candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
          position VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_votes_student_id ON votes(student_id);
        CREATE INDEX IF NOT EXISTS idx_votes_candidate_id ON votes(candidate_id);
        CREATE INDEX IF NOT EXISTS idx_votes_position ON votes(position);
      `);

      // Audit logs table
      await client.query(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          action VARCHAR(100) NOT NULL,
          entity_type VARCHAR(50),
          entity_id INTEGER,
          details JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
        CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
      `);

      // Activity tracking table
      await client.query(`
        CREATE TABLE IF NOT EXISTS activity_logs (
          id SERIAL PRIMARY KEY,
          student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
          status VARCHAR(50) NOT NULL CHECK(status IN ('logged_in', 'viewing_ballot', 'voting', 'submitted')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_activity_logs_student_id ON activity_logs(student_id);
        CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
      `);

      // Session table for express-session
      await client.query(`
        CREATE TABLE IF NOT EXISTS session (
          sid VARCHAR NOT NULL COLLATE "default" PRIMARY KEY,
          sess JSONB NOT NULL,
          expire TIMESTAMP NOT NULL
        )
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_session_expire ON session(expire);
      `);

      console.log('✓ All tables created successfully');
    } finally {
      client.release();
    }
  },

  down: async (pool) => {
    const client = await pool.connect();
    try {
      await client.query(`
        DROP TABLE IF EXISTS activity_logs;
        DROP TABLE IF EXISTS audit_logs;
        DROP TABLE IF EXISTS votes;
        DROP TABLE IF EXISTS candidates;
        DROP TABLE IF EXISTS admins;
        DROP TABLE IF EXISTS students;
        DROP TABLE IF EXISTS session;
      `);
      console.log('✓ All tables dropped');
    } finally {
      client.release();
    }
  }
};

module.exports = migration;
