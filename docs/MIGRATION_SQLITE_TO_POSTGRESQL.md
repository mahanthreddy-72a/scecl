# Migration: SQLite to PostgreSQL

This document explains the changes made to migrate from SQLite to PostgreSQL.

## What Changed

### 1. **Dependencies**

**Before (SQLite)**:
```json
{
  "better-sqlite3": "^9.0.0",
  "connect-sqlite3": "^0.9.13"
}
```

**After (PostgreSQL)**:
```json
{
  "pg": "^8.10.0",
  "connect-pg-simple": "^9.0.1"
}
```

### 2. **Database Connection** (`src/db.js`)

**Before**:
```javascript
const Database = require('better-sqlite3');
const db = new Database('path/to/file.db');
db.pragma('journal_mode = WAL');
```

**After**:
```javascript
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});
```

### 3. **Query Syntax**

All SQL queries were updated from SQLite to PostgreSQL syntax.

**SQLite Example**:
```javascript
db.prepare('SELECT * FROM students WHERE id = ?').get(id)
```

**PostgreSQL Example**:
```javascript
const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
const student = result.rows[0];
```

#### Key Differences:

| Feature | SQLite | PostgreSQL |
|---------|--------|-----------|
| Parameterized | `?` | `$1, $2, $3...` |
| Async | Synchronous | Async/await required |
| Date Functions | `CURRENT_TIMESTAMP` | `NOW()` |
| Boolean | `0/1` (INTEGER) | `TRUE/FALSE` (BOOLEAN) |
| Auto Increment | `AUTOINCREMENT` | `SERIAL` |
| Returning Rows | `.run()` returns insert count | `RETURNING *` clause |

### 4. **Database Schema** (`migrations/001_init.js`)

**Changes to DDL**:

```sql
-- SQLite
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scs_no TEXT UNIQUE NOT NULL,
  has_voted INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- PostgreSQL
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  scs_no VARCHAR(50) UNIQUE NOT NULL,
  has_voted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. **Session Management** (`src/index.js`)

**Before**:
```javascript
const SQLiteStore = require('connect-sqlite3')(session);
app.use(session({
  store: new SQLiteStore({ db: 'sessions.db' })
}));
```

**After**:
```javascript
const pgSession = require('connect-pg-simple')(session);
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session'
  })
}));
```

### 6. **Transactions**

**Before (Synchronous)**:
```javascript
const transaction = db.transaction(() => {
  // All operations
});
transaction();
```

**After (Async/Await)**:
```javascript
const client = await pool.connect();
try {
  await client.query('BEGIN');
  // Operations
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
}
```

### 7. **Error Handling**

**SQLite Error Codes**:
```javascript
if (error.message.includes('UNIQUE constraint failed'))
```

**PostgreSQL Error Codes**:
```javascript
if (error.code === '23505') // Unique violation
```

PostgreSQL error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html

### 8. **Controller Changes**

All controllers updated from synchronous to async/await:

```javascript
// Before
exports.getStudents = (req, res) => {
  const students = db.prepare(...).all();
  res.json({ students });
};

// After
exports.getStudents = async (req, res) => {
  try {
    const result = await pool.query(...);
    res.json({ students: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};
```

### 9. **Environment Configuration**

**New `.env` variables** required:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elections
DB_USER=postgres
DB_PASSWORD=postgres
```

See [PostgreSQL Setup Guide](POSTGRESQL_SETUP.md) for setup instructions.

## Migration Checklist

- [x] Update package.json dependencies
- [x] Update database connection (`db.js`)
- [x] Update migration scripts (`001_init.js`)
- [x] Update migration runner (`run.js`)
- [x] Update seed script (`seed.js`)
- [x] Update auth utilities (`utils/auth.js`)
- [x] Update audit logging (`utils/audit.js`)
- [x] Convert all controllers to async
- [x] Update all route handlers
- [x] Update Express server setup
- [x] Update session management
- [x] Update error handling
- [x] Update environment configuration
- [x] Add PostgreSQL setup guide
- [x] Update README

## Data Type Mappings

| SQLite | PostgreSQL | Notes |
|--------|-----------|-------|
| INTEGER | SERIAL/INT | For IDs, use SERIAL |
| TEXT | VARCHAR | For variable-length strings |
| BOOLEAN (0/1) | BOOLEAN | Use TRUE/FALSE |
| DATETIME | TIMESTAMP | `CURRENT_TIMESTAMP` vs `NOW()` |
| JSON | JSONB | Better for queries |
| UNIQUE | UNIQUE CONSTRAINT | Error code 23505 |

## Performance Improvements

1. **Connection Pooling**: PostgreSQL pool handles 20 concurrent connections
2. **Index Efficiency**: PostgreSQL indexes are more optimized
3. **Query Optimization**: Can use PostgreSQL EXPLAIN to analyze queries
4. **Concurrency**: Better handling of simultaneous users
5. **Scalability**: Designed to grow to thousands of users

## Backward Compatibility

This migration is **NOT backward compatible** with SQLite databases. 

**To migrate existing SQLite data**:

```bash
# Export from SQLite
sqlite3 elections.db ".mode csv" ".headers on" ".output students.csv" "SELECT * FROM students;"

# Import to PostgreSQL
psql -U postgres -d elections -c "\COPY students(scs_no, name, class, house) FROM 'students.csv' WITH (FORMAT csv, HEADER);"
```

## Testing

After migration, verify:

1. **Database Connection**:
```bash
npm run dev
# Should see: "✓ Connected to PostgreSQL database"
```

2. **Migrations**:
```bash
npm run db:migrate
# Should see: "✓ All tables created successfully"
```

3. **Seeding**:
```bash
npm run db:seed
# Should see: "✓ Database seeded successfully"
```

4. **API Endpoints**:
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok"}
```

5. **Student Login** (Frontend):
- Visit http://localhost:3000
- Login with SCS number (e.g., 1001)
- Vote and submit

## Rollback Plan

If issues occur, revert to SQLite:

1. Restore SQLite version from git
2. Remove `.env` changes
3. Downgrade dependencies
4. Restore SQLite database files

## Support & Troubleshooting

Common issues after migration:

- **"Connection refused"**: PostgreSQL not running
- **"password authentication failed"**: Wrong credentials in `.env`
- **"database does not exist"**: Run `npm run db:migrate`
- **"column does not exist"**: Schema mismatch, check migrations

See [PostgreSQL Setup Guide](POSTGRESQL_SETUP.md#troubleshooting) for detailed solutions.

## Next Steps

1. Read [PostgreSQL Setup Guide](POSTGRESQL_SETUP.md)
2. Set up PostgreSQL on your machine
3. Create `.env` with credentials
4. Run migrations: `npm run db:migrate`
5. Run seeds: `npm run db:seed`
6. Start server: `npm run dev`

## Summary

The migration to PostgreSQL provides:
- ✅ Better scalability for 1000+ users
- ✅ Production-grade reliability
- ✅ Connection pooling for efficiency
- ✅ Built-in transaction support
- ✅ Better error handling
- ✅ JSONB for flexible audit logs
- ✅ Session persistence

All code is now async/await based and follows PostgreSQL best practices.
