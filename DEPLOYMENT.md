# School Election System - Deployment Guide

## 🚀 Complete Setup for School Deployment

This guide helps you set up the election system in your school with fresh data.

---

## 📋 Table of Contents

1. [Reset Database](#reset-database)
2. [Import Students](#import-students)
3. [Add Candidates](#add-candidates)
4. [Run the System](#run-the-system)
5. [Security Setup](#security-setup)
6. [Troubleshooting](#troubleshooting)
7. [Maintenance](#maintenance)

---

## 🔄 Reset Database

**DELETE ALL existing students and candidates to start fresh:**

### Step 1: Connect to Database

```bash
# Connect to PostgreSQL
psql -U postgres -d elections
```

### Step 2: Clear All Data

```sql
-- DANGER: This deletes ALL data!
TRUNCATE TABLE votes CASCADE;
TRUNCATE TABLE candidates CASCADE;
TRUNCATE TABLE students CASCADE;
TRUNCATE TABLE activity_logs CASCADE;
TRUNCATE TABLE audit_logs CASCADE;

-- Verify all cleared
SELECT COUNT(*) FROM students;
SELECT COUNT(*) FROM candidates;
```

---

## 👥 Import Students

### Step 1: Prepare Student CSV File

Create a file: `students.csv`

```csv
scs_no,name,class,house
SCS1001,Student Name One,10A,Spartans
SCS1002,Student Name Two,10B,Vikings
SCS1003,Student Name Three,10A,Knights
SCS1004,Student Name Four,10B,Samurais
SCS1005,Student Name Five,11A,Spartans
```

**Requirements:**
- ✅ SCS number: 4+ digits, numeric only
- ✅ Name: Full name (no special characters)
- ✅ Class: Format like `10A`, `10B`, `11A`, `11B`
- ✅ House: EXACT spelling: `Spartans`, `Vikings`, `Knights`, `Samurais`
- ✅ One student per row (no merged cells)

### Step 2: Import via Admin Panel

1. **Login:** `http://localhost:3000/admin/login`
2. **Username:** `admin`
3. **Password:** `admin123`
4. **Go to:** `👨‍🎓 Students`
5. **Click:** `📤 Bulk Import`
6. **Select:** Your `students.csv` file
7. **Click:** `Import`

### Step 3: Verify Import

```sql
-- Check student count
SELECT COUNT(*) as total_students FROM students;

-- Check by house
SELECT house, COUNT(*) FROM students GROUP BY house;

-- Check sample students
SELECT scs_no, name, class, house FROM students LIMIT 5;
```

---

## 🎭 Add Candidates

### Method 1: Via Admin Panel (Recommended)

1. **Login to Admin:** `http://localhost:3000/admin/login`
2. **Go to:** `👥 Candidates`
3. **Click:** `➕ Add Candidate`
4. **Fill in:**
   - Name
   - Position (Head Boy, Head Girl, Sports Captain, etc.)
   - House (leave blank for school-wide, select for house positions)
   - Photo (optional)
5. **Click:** `Add`

### Method 2: Via SQL (Bulk)

```sql
-- School-wide positions (no house)
INSERT INTO candidates (name, position, house, vote_count) VALUES
('Candidate One', 'Head Boy', NULL, 0),
('Candidate Two', 'Head Boy', NULL, 0),
('Candidate Three', 'Head Boy', NULL, 0),
('Candidate Four', 'Head Boy', NULL, 0),
('Candidate Five', 'Head Girl', NULL, 0),
('Candidate Six', 'Head Girl', NULL, 0),
('Candidate Seven', 'Head Girl', NULL, 0),
('Candidate Eight', 'Head Girl', NULL, 0);

-- House-specific positions
INSERT INTO candidates (name, position, house, vote_count) VALUES
('House Candidate One', 'Spartans House Captain', 'Spartans', 0),
('House Candidate Two', 'Spartans House Captain', 'Spartans', 0),
('House Candidate Three', 'Spartans House Captain', 'Spartans', 0),
('House Candidate Four', 'Spartans House Vice Captain', 'Spartans', 0),
('House Candidate Five', 'Spartans House Vice Captain', 'Spartans', 0),
('House Candidate Six', 'Spartans House Vice Captain', 'Spartans', 0);

-- Verify
SELECT position, COUNT(*) FROM candidates GROUP BY position;
```

### Method 3: Bulk Import CSV (If available)

Similar to students, prepare a CSV and use the candidates bulk import.

---

## 🗳️ Available Voting Positions (16 Total)

### School-wide (8 positions)
1. Head Boy (4 candidates each)
2. Head Girl (4 candidates each)
3. Sports Captain (4 candidates each)
4. Sports Vice Captain (4 candidates each)
5. CCA Captain (4 candidates each)
6. CCA Vice Captain (4 candidates each)
7. Deputy Head Boy (4 candidates each)
8. Deputy Head Girl (4 candidates each)

### House-specific (8 positions)
Each of 4 houses (Spartans, Vikings, Knights, Samurais):
- House Captain (3 candidates each)
- House Vice Captain (3 candidates each)

---

## ▶️ Run the System

### Start Backend

```bash
cd backend
npm run start
```

You should see:
```
✓ Server running on http://localhost:5000
✓ Database: elections
✓ Connected to PostgreSQL database
📁 Serving static files from: /path/to/backend/uploads
```

### Start Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### Access the System

- **Student Voting:** `http://localhost:3000`
- **Admin Dashboard:** `http://localhost:3000/admin/login`
- **Results Dashboard:** `http://localhost:3000/admin/results`

---

## 🔒 Security Setup

### Change Admin Password

**CRITICAL: Change from default `admin123`**

```sql
-- First, generate a new password hash
-- Run this in Node.js terminal:
-- const bcrypt = require('bcrypt');
-- bcrypt.hash('YOUR_NEW_PASSWORD', 10).then(hash => console.log(hash))

UPDATE admins SET password_hash = 'YOUR_GENERATED_HASH' 
WHERE username = 'admin';
```

Or use the admin panel to change password if available.

### Set Environment Variables

**Create/update `backend/.env`:**

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elections
DB_USER=elections_user
DB_PASSWORD=your_secure_password
SESSION_SECRET=generate_random_key_here
NODE_ENV=production
PORT=5000
CORS_ORIGIN=http://your-school-network-ip:3000
```

**Generate SESSION_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Network Security

1. **Keep on school LAN only** - Don't expose to internet
2. **Use HTTPS if possible** in production
3. **Firewall ports** - Only 3000 and 5000 on school network
4. **Backup database daily**

---

## 🐛 Troubleshooting

### Students Can't Login
```sql
-- Check students exist
SELECT COUNT(*) FROM students;

-- Check specific student
SELECT * FROM students WHERE scs_no = 'SCS1001';

-- SCS number must be numeric, 4+ digits
```

### Images Not Loading
```bash
# Check images folder
ls -la backend/uploads/candidates/

# Restart backend
cd backend
npm run start
```

### Database Connection Failed
```bash
# Check PostgreSQL running
psql -U postgres -d elections

# If not, restart PostgreSQL
# Windows: Services → PostgreSQL → Start
# Linux: sudo systemctl start postgresql
```

### Double Voting Prevention
```sql
-- Check voted status
SELECT scs_no, name, has_voted FROM students LIMIT 10;

-- Reset a student's vote status (if needed)
UPDATE students SET has_voted = FALSE WHERE scs_no = 'SCS1001';
```

---

## 📊 Maintenance

### Monitor Voting Progress

```sql
-- Real-time statistics
SELECT 
  COUNT(*) as total_students,
  COUNT(CASE WHEN has_voted = TRUE THEN 1 END) as voted,
  ROUND(100.0 * COUNT(CASE WHEN has_voted = TRUE THEN 1 END) / COUNT(*), 2) as percentage_voted
FROM students;

-- By house
SELECT 
  house,
  COUNT(*) as total,
  COUNT(CASE WHEN has_voted = TRUE THEN 1 END) as voted
FROM students
GROUP BY house;

-- By class
SELECT 
  class,
  COUNT(*) as total,
  COUNT(CASE WHEN has_voted = TRUE THEN 1 END) as voted
FROM students
GROUP BY class;
```

### View Live Results

```sql
-- Winning candidate for each position
SELECT 
  c.position,
  c.name,
  c.house,
  COUNT(v.id) as votes
FROM candidates c
LEFT JOIN votes v ON c.id = v.candidate_id
GROUP BY c.id, c.position, c.name, c.house
ORDER BY c.position, votes DESC;

-- Top 3 for each position
SELECT DISTINCT ON (position)
  position,
  name,
  COUNT(*) as votes
FROM candidates c
LEFT JOIN votes v ON c.id = v.candidate_id
GROUP BY c.id, position, name
ORDER BY position, votes DESC;
```

### Backup Database

```bash
# Daily backup
pg_dump -U postgres elections > elections_backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U postgres elections < elections_backup_20260606.sql
```

---

## 🎯 Pre-Election Checklist

- [ ] Database reset and cleaned
- [ ] All students imported (check count matches)
- [ ] All candidates added with photos
- [ ] Admin password changed from default
- [ ] Tested with sample student login
- [ ] Verified voting submission works
- [ ] Checked results page shows correct data
- [ ] Tested logout functionality
- [ ] Confirmed duplicate vote prevention
- [ ] Backup taken before election day
- [ ] Network/firewall configured
- [ ] Both servers running and accessible
- [ ] Briefed staff on admin panel

---

## 📞 Common Commands

### Reset Everything

```bash
# 1. Clear database
psql -U postgres -d elections << 'EOF'
TRUNCATE votes CASCADE;
TRUNCATE candidates CASCADE;
TRUNCATE students CASCADE;
EOF

# 2. Restart both servers
# Stop: Ctrl+C in both terminals
# Start backend: cd backend && npm run start
# Start frontend: cd frontend && npm run dev
```

### Export Results After Election

```sql
-- Export all votes with candidate info
COPY (
  SELECT 
    c.position,
    c.name,
    c.house,
    COUNT(v.id) as vote_count
  FROM candidates c
  LEFT JOIN votes v ON c.id = v.candidate_id
  GROUP BY c.id, c.position, c.name, c.house
  ORDER BY c.position, vote_count DESC
) TO STDOUT WITH CSV HEADER;
```

---

## 📝 Notes for School Admin

1. **Keep at least 2 admins** with different passwords
2. **Never share election database** with students
3. **Back up after each election** for records
4. **Clear data before next election** (see Reset Everything)
5. **Document any customizations** made

---

## 🆘 Support

If you encounter issues:

1. **Check the logs** in backend terminal
2. **Verify database connection** with `psql`
3. **Restart servers** (stop and start fresh)
4. **Check firewall** - ensure ports 3000, 5000 are accessible on LAN
5. **Review error messages** in browser console (F12)

---

**Your school election system is ready to deploy!** 🎉

Good luck with your elections! 🗳️✨
