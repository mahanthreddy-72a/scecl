# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in another terminal)
cd frontend
npm install
```

### 2. Initialize Database

```bash
cd backend
npm run db:migrate
npm run db:seed
```

This creates:
- Empty election database
- Default admin account: `admin` / `admin123`
- 30 test students (SCS 1001-1030)
- Sample candidates for all positions

### 3. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

### 4. Test the System

#### As a Student:
1. Open http://localhost:3000
2. Enter SCS number: `1001`
3. Confirm your identity
4. Vote for all positions
5. Submit votes
6. See success message

#### As an Admin:
1. Go to http://localhost:3000/admin/login
2. Username: `admin`
3. Password: `admin123`
4. View dashboard with live statistics
5. Manage candidates, students, and results

## Key URLs

| Page | URL |
|------|-----|
| Student Voting | http://localhost:3000 |
| Admin Login | http://localhost:3000/admin/login |
| Admin Dashboard | http://localhost:3000/admin/dashboard |
| Admin Candidates | http://localhost:3000/admin/candidates |
| Admin Students | http://localhost:3000/admin/students |
| Admin Results | http://localhost:3000/admin/results |

## Test SCS Numbers

After seeding, use any of these:
- 1001, 1002, 1003, ... 1030

## Common Commands

```bash
# Backend
npm run dev              # Start dev server
npm run db:migrate       # Run migrations
npm run db:seed         # Seed test data
npm start               # Production server

# Frontend
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
```

## Database

- **Location**: `database/elections.db`
- **Format**: SQLite 3
- **WAL Mode**: Enabled for concurrency

### Reset Database

```bash
rm database/elections.db*
npm run db:migrate
npm run db:seed
```

## API Testing

Test API with curl:

```bash
# Student login
curl -X POST http://localhost:5000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"scs_no":"1001"}' \
  -c cookies.txt

# Get student status
curl http://localhost:5000/api/auth/student/status -b cookies.txt

# Admin login
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c admin_cookies.txt

# Get dashboard stats
curl http://localhost:5000/api/dashboard/stats -b admin_cookies.txt
```

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 5000
# On macOS/Linux:
lsof -ti:5000 | xargs kill -9

# On Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

**Database locked?**
```bash
cd database
rm elections.db-wal elections.db-shm
```

**Package issues?**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

## Next Steps

1. **Read CLAUDE.md** - Developer documentation
2. **Read README.md** - Full feature documentation
3. **Modify seed data** - Edit `backend/src/seeds/seed.js`
4. **Configure admin** - Change default password in production
5. **Deploy** - Follow deployment section in README.md

## Production Deployment

Before going live:

1. [ ] Change admin password
2. [ ] Set environment variables (`.env`)
3. [ ] Build frontend: `npm run build`
4. [ ] Set `NODE_ENV=production`
5. [ ] Back up database
6. [ ] Test complete voting flow
7. [ ] Brief admins on dashboard

See README.md for detailed deployment instructions.

---

Questions? Check CLAUDE.md for development guide or README.md for full documentation.
