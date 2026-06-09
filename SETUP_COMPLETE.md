# School Elections System - Complete Setup Guide

This guide contains **ALL commands and procedures** to set up the school election system from scratch.

---

## 📋 Table of Contents

1. [Database Connection](#database-connection)
2. [Reset & Clear Database](#reset--clear-database)
3. [Import Students](#import-students)
4. [Add Candidates](#add-candidates)
5. [Run the System](#run-the-system)
6. [Security Setup](#security-setup)
7. [Troubleshooting](#troubleshooting)
8. [Verification Queries](#verification-queries)

---

## 🔗 Database Connection

### Step 1: Open PostgreSQL Terminal

**Windows:**
```bash
psql -U postgres -d elections
```

**If password required:**
```bash
psql -U postgres -d elections -h localhost -p 5432
```

**Connection Details:**
```
Host: localhost
Port: 5432
Database: elections
User: postgres
Password: postgres
```

---

## 🔄 Reset & Clear Database

### Clear ALL Data (Fresh Start)

⚠️ **WARNING: This deletes everything!**

```sql
-- DANGER: Delete all data in all tables
TRUNCATE TABLE votes CASCADE;
TRUNCATE TABLE candidates CASCADE;
TRUNCATE TABLE students CASCADE;
TRUNCATE TABLE activity_logs CASCADE;
TRUNCATE TABLE audit_logs CASCADE;

-- Verify all cleared
SELECT COUNT(*) as students FROM students;
SELECT COUNT(*) as candidates FROM candidates;
SELECT COUNT(*) as votes FROM votes;
```

Expected output: All should show `0`

---

## 👥 Import Students

### Step 1: Prepare CSV File

Create a file named `students.csv` with this format:

```csv
scs_no,name,class,house
SCS1001,Student Name One,10A,Spartans
SCS1002,Student Name Two,10B,Vikings
SCS1003,Student Name Three,10A,Knights
SCS1004,Student Name Four,10B,Samurais
SCS1005,Student Name Five,11A,Spartans
SCS1006,Student Name Six,11B,Vikings
```

**Requirements:**
- ✅ SCS number: Must start with `SCS` followed by 4+ digits
- ✅ Name: Full name (no special characters)
- ✅ Class: Format like `10A`, `10B`, `11A`, `11B`
- ✅ House: EXACT spelling: `Spartans`, `Vikings`, `Knights`, `Samurais`
- ✅ One student per row (no merged cells)

### Step 2: Import via Admin Panel

1. **Start backend & frontend:**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run start
   
   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

2. **Go to Admin Panel:**
   - URL: `http://localhost:3000/admin/login`
   - Username: `admin`
   - Password: `admin123`

3. **Navigate to Students:**
   - Click: `👨‍🎓 Students`

4. **Import CSV:**
   - Click: `📤 Bulk Import`
   - Select: Your `students.csv` file
   - Click: `Import`

### Step 3: Verify Import

```sql
-- Check total students imported
SELECT COUNT(*) as total_students FROM students;

-- Check by house
SELECT house, COUNT(*) FROM students GROUP BY house;

-- Check sample students
SELECT scs_no, name, class, house FROM students LIMIT 10;

-- Check by class
SELECT class, COUNT(*) FROM students GROUP BY class ORDER BY class;
```

### Step 3: Add Teacher/Staff Account (For Multiple Voting)

**Teachers and staff can vote multiple times using ID: `0000` or `SCS0000`**

```sql
-- Add teacher/staff account for multiple voting
INSERT INTO students (scs_no, name, class, house, has_voted) VALUES
('SCS0000', 'Staff/Teacher Account', 'Faculty', 'Admin', false);

-- Verify
SELECT * FROM students WHERE scs_no = 'SCS0000';
```

**How to use:**
- Go to: `http://localhost:3000`
- Enter: `0000` (or `SCS0000`)
- Click Continue
- Vote for all positions
- Click Submit
- **You can vote again!** (No "already voted" error)
- Repeat as needed

**Key differences for teachers:**
- ✅ Can vote multiple times
- ✅ Can vote for ALL house positions (not just one)
- ✅ Votes are counted normally
- ✅ No "You have already voted" error

---

### Alternative: SQL Import (Manual)

#### Add 10 Sample Students

```sql
-- Insert 10 students directly
INSERT INTO students (scs_no, name, class, house, has_voted) VALUES
('SCS1001', 'Aarav Kumar', '10A', 'Spartans', false),
('SCS1002', 'Priya Singh', '10B', 'Vikings', false),
('SCS1003', 'Rohan Patel', '10A', 'Knights', false),
('SCS1004', 'Ananya Sharma', '10B', 'Samurais', false),
('SCS1005', 'Arjun Verma', '11A', 'Spartans', false),
('SCS1006', 'Diya Gupta', '11B', 'Vikings', false),
('SCS1007', 'Vikas Rao', '10C', 'Knights', false),
('SCS1008', 'Neha Malhotra', '11C', 'Samurais', false),
('SCS1009', 'Aditya Nair', '10A', 'Vikings', false),
('SCS1010', 'Shreya Das', '11A', 'Knights', false);

-- Verify
SELECT COUNT(*) FROM students;
SELECT * FROM students;
```

#### Or Add More Students

```sql
-- Insert 20 students (total 30)
INSERT INTO students (scs_no, name, class, house, has_voted) VALUES
('SCS1011', 'Karan Singh', '10B', 'Spartans', false),
('SCS1012', 'Megha Patel', '11A', 'Vikings', false),
('SCS1013', 'Sanjay Kumar', '10C', 'Knights', false),
('SCS1014', 'Pooja Sharma', '10A', 'Samurais', false),
('SCS1015', 'Rishabh Verma', '11B', 'Spartans', false),
('SCS1016', 'Isha Gupta', '10B', 'Vikings', false),
('SCS1017', 'Harman Singh', '11C', 'Knights', false),
('SCS1018', 'Sakshi Rao', '10C', 'Samurais', false),
('SCS1019', 'Nikhil Nair', '11A', 'Spartans', false),
('SCS1020', 'Vaanya Das', '10A', 'Vikings', false),
('SCS1021', 'Ashok Kumar', '10B', 'Knights', false),
('SCS1022', 'Radhika Singh', '11B', 'Samurais', false),
('SCS1023', 'Siddharth Patel', '10C', 'Spartans', false),
('SCS1024', 'Aditi Sharma', '11A', 'Vikings', false),
('SCS1025', 'Vikram Verma', '10A', 'Knights', false),
('SCS1026', 'Chithra Gupta', '10B', 'Samurais', false),
('SCS1027', 'Pranav Singh', '11C', 'Spartans', false),
('SCS1028', 'Riya Rao', '10C', 'Vikings', false),
('SCS1029', 'Deepak Nair', '11B', 'Knights', false),
('SCS1030', 'Swara Das', '10A', 'Samurais', false);

-- Verify total count
SELECT COUNT(*) as total_students FROM students;
SELECT house, COUNT(*) as count FROM students GROUP BY house;
```

---

## 🎭 Add Candidates

### Option 1: Via Admin Panel (Easiest)

1. **Go to Admin Panel:** `http://localhost:3000/admin/login`
2. **Navigate:** Click `👥 Candidates`
3. **Add Candidate:**
   - Click: `➕ Add Candidate`
   - Fill: Name, Position, House (if applicable), Photo (optional)
   - Click: `✅ Add Candidate`

### Option 2: SQL - Add 64 Candidates (All Roles)

**Copy and paste this entire block into psql:**

```sql
-- ========================================
-- SCHOOL-WIDE POSITIONS (9 roles × 4 candidates each)
-- ========================================

-- HEAD BOY (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Head Boy', NULL, '/uploads/candidates/hb-1.jpg', 0),
('Candidate 2', 'Head Boy', NULL, '/uploads/candidates/hb-2.jpg', 0),
('Candidate 3', 'Head Boy', NULL, '/uploads/candidates/hb-3.jpg', 0),
('Candidate 4', 'Head Boy', NULL, '/uploads/candidates/hb-4.jpg', 0);

-- HEAD GIRL (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Head Girl', NULL, '/uploads/candidates/hg-1.jpg', 0),
('Candidate 2', 'Head Girl', NULL, '/uploads/candidates/hg-2.jpg', 0),
('Candidate 3', 'Head Girl', NULL, '/uploads/candidates/hg-3.jpg', 0),
('Candidate 4', 'Head Girl', NULL, '/uploads/candidates/hg-4.jpg', 0);

-- DEPUTY HEAD BOY (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Deputy Head Boy', NULL, '/uploads/candidates/dhb-1.jpg', 0),
('Candidate 2', 'Deputy Head Boy', NULL, '/uploads/candidates/dhb-2.jpg', 0),
('Candidate 3', 'Deputy Head Boy', NULL, '/uploads/candidates/dhb-3.jpg', 0),
('Candidate 4', 'Deputy Head Boy', NULL, '/uploads/candidates/dhb-4.jpg', 0);

-- DEPUTY HEAD GIRL (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Deputy Head Girl', NULL, '/uploads/candidates/dhg-1.jpg', 0),
('Candidate 2', 'Deputy Head Girl', NULL, '/uploads/candidates/dhg-2.jpg', 0),
('Candidate 3', 'Deputy Head Girl', NULL, '/uploads/candidates/dhg-3.jpg', 0),
('Candidate 4', 'Deputy Head Girl', NULL, '/uploads/candidates/dhg-4.jpg', 0);

-- SPORTS CAPTAIN (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Sports Captain', NULL, '/uploads/candidates/sc-1.jpg', 0),
('Candidate 2', 'Sports Captain', NULL, '/uploads/candidates/sc-2.jpg', 0),
('Candidate 3', 'Sports Captain', NULL, '/uploads/candidates/sc-3.jpg', 0),
('Candidate 4', 'Sports Captain', NULL, '/uploads/candidates/sc-4.jpg', 0);

-- SPORTS VICE CAPTAIN (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Sports Vice Captain', NULL, '/uploads/candidates/svc-1.jpg', 0),
('Candidate 2', 'Sports Vice Captain', NULL, '/uploads/candidates/svc-2.jpg', 0),
('Candidate 3', 'Sports Vice Captain', NULL, '/uploads/candidates/svc-3.jpg', 0),
('Candidate 4', 'Sports Vice Captain', NULL, '/uploads/candidates/svc-4.jpg', 0);

-- CCA CAPTAIN (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'CCA Captain', NULL, '/uploads/candidates/cc-1.jpg', 0),
('Candidate 2', 'CCA Captain', NULL, '/uploads/candidates/cc-2.jpg', 0),
('Candidate 3', 'CCA Captain', NULL, '/uploads/candidates/cc-3.jpg', 0),
('Candidate 4', 'CCA Captain', NULL, '/uploads/candidates/cc-4.jpg', 0);

-- CCA VICE CAPTAIN (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'CCA Vice Captain', NULL, '/uploads/candidates/cvc-1.jpg', 0),
('Candidate 2', 'CCA Vice Captain', NULL, '/uploads/candidates/cvc-2.jpg', 0),
('Candidate 3', 'CCA Vice Captain', NULL, '/uploads/candidates/cvc-3.jpg', 0),
('Candidate 4', 'CCA Vice Captain', NULL, '/uploads/candidates/cvc-4.jpg', 0);

-- CULTURAL SECRETARY (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Cultural Secretary', NULL, '/uploads/candidates/cs-1.jpg', 0),
('Candidate 2', 'Cultural Secretary', NULL, '/uploads/candidates/cs-2.jpg', 0),
('Candidate 3', 'Cultural Secretary', NULL, '/uploads/candidates/cs-3.jpg', 0),
('Candidate 4', 'Cultural Secretary', NULL, '/uploads/candidates/cs-4.jpg', 0);

-- ========================================
-- HOUSE-SPECIFIC POSITIONS (8 roles × 4 candidates each)
-- ========================================

-- SPARTANS HOUSE CAPTAIN (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Spartans House Captain', 'Spartans', '/uploads/candidates/shc-1.jpg', 0),
('Candidate 2', 'Spartans House Captain', 'Spartans', '/uploads/candidates/shc-2.jpg', 0),
('Candidate 3', 'Spartans House Captain', 'Spartans', '/uploads/candidates/shc-3.jpg', 0),
('Candidate 4', 'Spartans House Captain', 'Spartans', '/uploads/candidates/shc-4.jpg', 0);

-- SPARTANS HOUSE VICE CAPTAIN (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Spartans House Vice Captain', 'Spartans', '/uploads/candidates/shvc-1.jpg', 0),
('Candidate 2', 'Spartans House Vice Captain', 'Spartans', '/uploads/candidates/shvc-2.jpg', 0),
('Candidate 3', 'Spartans House Vice Captain', 'Spartans', '/uploads/candidates/shvc-3.jpg', 0),
('Candidate 4', 'Spartans House Vice Captain', 'Spartans', '/uploads/candidates/shvc-4.jpg', 0);

-- VIKINGS HOUSE CAPTAIN (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Vikings House Captain', 'Vikings', '/uploads/candidates/vhc-1.jpg', 0),
('Candidate 2', 'Vikings House Captain', 'Vikings', '/uploads/candidates/vhc-2.jpg', 0),
('Candidate 3', 'Vikings House Captain', 'Vikings', '/uploads/candidates/vhc-3.jpg', 0),
('Candidate 4', 'Vikings House Captain', 'Vikings', '/uploads/candidates/vhc-4.jpg', 0);

-- VIKINGS HOUSE VICE CAPTAIN (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Vikings House Vice Captain', 'Vikings', '/uploads/candidates/vhvc-1.jpg', 0),
('Candidate 2', 'Vikings House Vice Captain', 'Vikings', '/uploads/candidates/vhvc-2.jpg', 0),
('Candidate 3', 'Vikings House Vice Captain', 'Vikings', '/uploads/candidates/vhvc-3.jpg', 0),
('Candidate 4', 'Vikings House Vice Captain', 'Vikings', '/uploads/candidates/vhvc-4.jpg', 0);

-- KNIGHTS HOUSE CAPTAIN (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Knights House Captain', 'Knights', '/uploads/candidates/khc-1.jpg', 0),
('Candidate 2', 'Knights House Captain', 'Knights', '/uploads/candidates/khc-2.jpg', 0),
('Candidate 3', 'Knights House Captain', 'Knights', '/uploads/candidates/khc-3.jpg', 0),
('Candidate 4', 'Knights House Captain', 'Knights', '/uploads/candidates/khc-4.jpg', 0);

-- KNIGHTS HOUSE VICE CAPTAIN (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Knights House Vice Captain', 'Knights', '/uploads/candidates/khvc-1.jpg', 0),
('Candidate 2', 'Knights House Vice Captain', 'Knights', '/uploads/candidates/khvc-2.jpg', 0),
('Candidate 3', 'Knights House Vice Captain', 'Knights', '/uploads/candidates/khvc-3.jpg', 0),
('Candidate 4', 'Knights House Vice Captain', 'Knights', '/uploads/candidates/khvc-4.jpg', 0);

-- SAMURAIS HOUSE CAPTAIN (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Samurais House Captain', 'Samurais', '/uploads/candidates/samhc-1.jpg', 0),
('Candidate 2', 'Samurais House Captain', 'Samurais', '/uploads/candidates/samhc-2.jpg', 0),
('Candidate 3', 'Samurais House Captain', 'Samurais', '/uploads/candidates/samhc-3.jpg', 0),
('Candidate 4', 'Samurais House Captain', 'Samurais', '/uploads/candidates/samhc-4.jpg', 0);

-- SAMURAIS HOUSE VICE CAPTAIN (4 candidates)
INSERT INTO candidates (name, position, house, image_path, vote_count) VALUES
('Candidate 1', 'Samurais House Vice Captain', 'Samurais', '/uploads/candidates/samhvc-1.jpg', 0),
('Candidate 2', 'Samurais House Vice Captain', 'Samurais', '/uploads/candidates/samhvc-2.jpg', 0),
('Candidate 3', 'Samurais House Vice Captain', 'Samurais', '/uploads/candidates/samhvc-3.jpg', 0),
('Candidate 4', 'Samurais House Vice Captain', 'Samurais', '/uploads/candidates/samhvc-4.jpg', 0);

-- ========================================
-- VERIFY THE IMPORT
-- ========================================
SELECT position, COUNT(*) as candidate_count FROM candidates GROUP BY position ORDER BY position;
SELECT COUNT(*) as total_candidates FROM candidates;
```

**Expected output:**
- Total candidates: **68** (17 positions × 4 candidates each)

---

## ▶️ Run the System

### Terminal 1: Start Backend

```bash
cd backend
npm run start
```

**Expected output:**
```
✓ Server running on http://localhost:5000
✓ Database: elections
✓ Connected to PostgreSQL database
📁 Serving static files from: /path/to/backend/uploads
```

### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### Access the System

- **Student Voting:** `http://localhost:3000`
- **Admin Panel:** `http://localhost:3000/admin/login`
  - Username: `admin`
  - Password: `admin123`
- **Results Dashboard:** `http://localhost:3000/admin/results`

---

## 🔒 Security Setup

### Change Admin Password

⚠️ **CRITICAL: Change from default `admin123`**

#### Method 1: Generate New Hash (Recommended)

```bash
# In Terminal, run Node.js
node
```

```javascript
// Inside Node.js terminal
const bcrypt = require('bcrypt');
bcrypt.hash('YOUR_NEW_PASSWORD', 10).then(hash => console.log(hash));
```

Copy the generated hash.

```sql
-- Update in PostgreSQL
UPDATE admins SET password_hash = 'PASTE_YOUR_HASH_HERE' WHERE username = 'admin';

-- Verify
SELECT username, password_hash FROM admins;
```

#### Method 2: Via Admin Panel

1. Go to Admin Panel: `http://localhost:3000/admin/login`
2. Login with `admin` / `admin123`
3. Look for password change option (if available)

### Set Environment Variables

Create/update `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elections
DB_USER=postgres
DB_PASSWORD=postgres
SESSION_SECRET=your-super-secret-key-here-change-this
NODE_ENV=production
PORT=5000
CORS_ORIGIN=http://your-school-network-ip:3000
```

**Generate SESSION_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Network Security

1. **Keep on School LAN Only** - Don't expose to internet
2. **Use HTTPS if possible** in production
3. **Firewall ports:**
   - Port 3000 (Frontend) - School network only
   - Port 5000 (Backend) - School network only
4. **Back up database daily**

---

## 🐛 Troubleshooting

### Students Can't Login

```sql
-- Check students exist
SELECT COUNT(*) FROM students;

-- Check specific student
SELECT * FROM students WHERE scs_no = 'SCS1001';

-- SCS number must be 4+ numeric digits after SCS prefix
```

### Images Not Loading

```bash
# Check images folder
ls -la backend/uploads/candidates/

# Restart backend server
# Stop: Ctrl+C in backend terminal
# Start: cd backend && npm run start
```

### Database Connection Failed

```bash
# Check PostgreSQL running
psql -U postgres -d elections

# If not running:
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

### Rate Limiting Issues (429 Error)

The system has:
- Development: 10,000 requests per 15 minutes
- Production: 100 requests per 15 minutes

To change, edit `backend/src/index.js`:

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 10000
});
```

---

## ✅ Verification Queries

### Check Everything is Set Up

```sql
-- 1. Check students count
SELECT COUNT(*) as total_students FROM students;

-- 2. Check candidates count
SELECT COUNT(*) as total_candidates FROM candidates;

-- 3. Check positions are complete
SELECT position, COUNT(*) as candidates FROM candidates 
GROUP BY position ORDER BY position;

-- 4. Check houses
SELECT house, COUNT(*) FROM students GROUP BY house;

-- 5. Check no one voted yet
SELECT COUNT(*) as voted_count FROM students WHERE has_voted = TRUE;

-- 6. Check admin account exists
SELECT username FROM admins;

-- 7. All positions should have candidates
SELECT COUNT(DISTINCT position) as total_positions FROM candidates;
```

**Expected output:**
```
total_students:     [Your imported count]
total_candidates:   68 (if all added)
total_positions:    17 (all voting positions)
voted_count:        0 (before election)
```

---

## 📊 Monitor Voting Progress

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

---

## 💾 Backup Database

```bash
# Daily backup
pg_dump -U postgres elections > elections_backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U postgres elections < elections_backup_20260606.sql
```

---

## 🎯 Complete Setup Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `elections` created
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Students imported (CSV or SQL)
- [ ] 64 candidates added (all positions)
- [ ] Admin password changed from default
- [ ] Environment variables set (.env file)
- [ ] Both servers started (backend + frontend)
- [ ] Login with test student works
- [ ] Admin panel accessible
- [ ] Results dashboard shows data
- [ ] Test voting works end-to-end
- [ ] Database backed up

---

## 🚀 Quick Start Commands

**All-in-one setup (copy-paste one by one):**

```bash
# 1. Navigate to project
cd c:\Users\Leesha Labs\Documents\elections

# 2. Start backend
cd backend && npm run start

# 3. In new terminal: Start frontend
cd frontend && npm run dev

# 4. In psql terminal: Clear database (if restarting)
psql -U postgres -d elections
TRUNCATE TABLE votes CASCADE;
TRUNCATE TABLE candidates CASCADE;
TRUNCATE TABLE students CASCADE;

# 5. Import students and add candidates via admin panel
# OR paste the SQL commands above
```

---

## 📞 Support

If you encounter issues:

1. **Check the logs** in backend terminal
2. **Verify database connection** with `psql -U postgres -d elections`
3. **Restart servers** (Ctrl+C and start fresh)
4. **Check firewall** - ensure ports 3000, 5000 are accessible on LAN
5. **Review error messages** in browser console (F12)

---

**Your school election system is ready! 🎉**

Good luck with your elections! 🗳️✨
