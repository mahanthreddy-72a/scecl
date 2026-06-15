# PostgreSQL Setup Guide

This guide walks you through setting up PostgreSQL for the School Election Management System.

## Prerequisites

- PostgreSQL 12+ installed on your machine
- Node.js 16+
- npm or yarn

## Installation

### macOS (Homebrew)

```bash
brew install postgresql@15
brew services start postgresql@15
```

### Windows

1. Download installer from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Note the password you set for the `postgres` user
4. PostgreSQL will start automatically

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Linux (Fedora/RHEL)

```bash
sudo yum install postgresql postgresql-server
sudo systemctl start postgresql
```

## Create Database and User

### Using pgAdmin (Easiest for Windows)

1. Open pgAdmin (installed with PostgreSQL)
2. Right-click "Databases" → Create → Database
3. Name: `elections`
4. Create a new user with password

### Using Terminal/Command Line

```bash
# Connect to PostgreSQL as default user
psql -U postgres

# Create database
CREATE DATABASE elections;

# Create user (optional, you can use postgres user)
CREATE USER elections_user WITH PASSWORD 'secure_password_here';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE elections TO elections_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO elections_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO elections_user;

# Exit psql
\q
```

## Configure Application

### 1. Create `.env` file

```bash
cd backend
cp .env.example .env
```

### 2. Edit `.env` with your PostgreSQL credentials

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
SESSION_SECRET=your-secret-key-here

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elections
DB_USER=postgres
DB_PASSWORD=postgres
```

**Important**: Replace `postgres` and password with your actual credentials!

## Initialize Database

### 1. Create PostgreSQL tables

```bash
npm run db:migrate
```

This will:
- Connect to PostgreSQL
- Create all required tables
- Create indexes for performance
- Create session table for express-session

### 2. Seed test data (optional)

```bash
npm run db:seed
```

This will:
- Add 1 admin account (username: `admin`, password: `admin123`)
- Add 30 test students (SCS 1001-1030)
- Add candidate records for all positions

### 3. Verify database

```bash
# Connect to database
psql -U postgres -d elections

# List tables
\dt

# Check if session table exists
SELECT * FROM session LIMIT 1;

# Exit
\q
```

## Running the Application

### Start Backend

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
✓ Connected to PostgreSQL database
✓ Server running on http://localhost:5000
✓ Database: elections
```

### Start Frontend (in another terminal)

```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:3000

## Troubleshooting

### "connect ECONNREFUSED 127.0.0.1:5432"

**Problem**: PostgreSQL server is not running

**Solutions**:
- **macOS**: `brew services start postgresql@15`
- **Windows**: Check Services app, start PostgreSQL service
- **Linux**: `sudo systemctl start postgresql`

### "password authentication failed for user 'postgres'"

**Problem**: Wrong password in `.env`

**Solution**: Reset PostgreSQL password:

```bash
# macOS/Linux
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'newpassword';
\q

# Windows (open Command Prompt as Admin)
psql -U postgres
ALTER USER postgres WITH PASSWORD 'newpassword';
\q
```

### "FATAL: database 'elections' does not exist"

**Problem**: Database not created

**Solution**:
```bash
psql -U postgres -c "CREATE DATABASE elections;"
```

### "column 'has_voted' does not exist"

**Problem**: Database schema not initialized

**Solution**:
```bash
npm run db:migrate
```

### Port 5432 already in use

```bash
# Find process using port 5432
lsof -i :5432

# Kill the process (if it's not PostgreSQL)
kill -9 <PID>

# Or restart PostgreSQL
brew services restart postgresql@15  # macOS
sudo systemctl restart postgresql     # Linux
```

## Backup & Restore

### Backup Database

```bash
# Full backup
pg_dump -U postgres elections > elections_backup.sql

# Custom format (smaller file)
pg_dump -U postgres -Fc elections > elections_backup.dump
```

### Restore Database

```bash
# From SQL file
psql -U postgres -d elections < elections_backup.sql

# From custom format
pg_restore -U postgres -d elections elections_backup.dump
```

## Performance Tips

1. **Connection Pooling**: Already configured with 20 connections in `db.js`

2. **Indexes**: Automatically created on:
   - `students.scs_no` - for student lookups
   - `students.has_voted` - for vote filtering
   - `candidates.position` - for position queries
   - `candidates.house` - for house-specific queries
   - `votes.student_id` - for vote verification
   - `votes.candidate_id` - for result counting
   - `activity_logs.created_at` - for recent activity

3. **WAL Mode**: Not needed in PostgreSQL (built-in)

4. **Monitoring**:
```bash
# Check active connections
psql -U postgres -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"

# Check database size
psql -U postgres -c "SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database WHERE datname = 'elections';"
```

## Upgrade PostgreSQL

### macOS

```bash
brew upgrade postgresql@15
brew services restart postgresql@15
```

### Linux

```bash
sudo apt-get upgrade postgresql
sudo systemctl restart postgresql
```

### Windows

- Download new installer
- Run installer and select upgrade option
- Existing data is preserved

## Production Deployment

### Security Checklist

- [ ] Change `postgres` user password
- [ ] Create separate `elections_user` with limited privileges
- [ ] Use SSL connections (set in connection string)
- [ ] Enable PostgreSQL password authentication
- [ ] Use strong `SESSION_SECRET`
- [ ] Set `NODE_ENV=production`
- [ ] Use environment-specific credentials

### Connection String for Production

```env
# Use environment variables instead of .env
DB_HOST=your-database-server.com
DB_PORT=5432
DB_NAME=elections
DB_USER=elections_user
DB_PASSWORD=very_secure_password
```

### Scaling Tips

- Use connection pooling (PgBouncer for 1000+ users)
- Set up read replicas for reporting
- Archive old votes/logs periodically
- Monitor slow queries with `log_min_duration_statement`

## Additional Resources

- PostgreSQL Docs: https://www.postgresql.org/docs/
- pgAdmin: https://www.pgadmin.org/
- DBeaver (Free SQL IDE): https://dbeaver.io/
- PostMan (API Testing): https://www.postman.com/

## Support

If you encounter issues:

1. Check PostgreSQL is running: `pg_isready`
2. Verify credentials in `.env`
3. Check error logs: `npm run dev`
4. Review PostgreSQL logs: `/var/log/postgresql/` (Linux) or Event Viewer (Windows)
