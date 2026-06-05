# PostgreSQL Quick Start

Get PostgreSQL up and running in 5 minutes.

## 1. Install PostgreSQL

### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Windows
Download from: https://www.postgresql.org/download/windows/

### Linux (Ubuntu)
```bash
sudo apt-get install postgresql
sudo systemctl start postgresql
```

## 2. Create Database

```bash
psql -U postgres -c "CREATE DATABASE elections;"
```

## 3. Configure Application

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elections
DB_USER=postgres
DB_PASSWORD=postgres
```

## 4. Initialize Database

```bash
npm install
npm run db:migrate
npm run db:seed
```

## 5. Start Application

```bash
npm run dev
```

Expected output:
```
✓ Connected to PostgreSQL database
✓ Server running on http://localhost:5000
✓ Database: elections
```

## 6. Test It

```bash
# Health check
curl http://localhost:5000/health

# Student login (from another terminal)
curl -X POST http://localhost:5000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"scs_no":"1001"}'
```

## Common Commands

```bash
# Check if PostgreSQL is running
pg_isready

# Connect to database
psql -U postgres -d elections

# List tables
\dt

# Exit psql
\q

# Backup database
pg_dump -U postgres elections > backup.sql

# Restore database
psql -U postgres -d elections < backup.sql
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection refused | Start PostgreSQL: `brew services start postgresql@15` |
| Password failed | Update `.env` with correct credentials |
| Database doesn't exist | Run: `psql -U postgres -c "CREATE DATABASE elections;"` |
| Tables don't exist | Run: `npm run db:migrate` |

## Next Steps

- [Full PostgreSQL Setup Guide](POSTGRESQL_SETUP.md)
- [Migration Details](MIGRATION_SQLITE_TO_POSTGRESQL.md)
- [API Documentation](API.md)
- [Main README](../README.md)
