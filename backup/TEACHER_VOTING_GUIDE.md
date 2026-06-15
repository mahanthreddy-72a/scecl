# 👨‍🏫 Teacher/Staff Voting System - Complete Guide

This guide explains how teachers and staff can vote multiple times using a special ID.

---

## 🎯 Overview

The system allows teachers and staff to:
- ✅ Vote multiple times (no "already voted" restriction)
- ✅ Vote for ALL house positions (not just one house)
- ✅ Use a simple ID: `0000` or `SCS0000`
- ✅ Same voting interface as students
- ✅ Votes are counted normally in results

---

## 📋 Setup Instructions

### Step 1: Add Teacher Account to Database

Before the election, add the teacher/staff account:

```bash
psql -U postgres -d elections
```

```sql
-- Add teacher/staff account
INSERT INTO students (scs_no, name, class, house, has_voted) VALUES
('SCS0000', 'Staff/Teacher Account', 'Faculty', 'Admin', false);

-- Verify
SELECT * FROM students WHERE scs_no = 'SCS0000';
```

**Expected output:**
```
 id │   scs_no   │          name          │  class  │ house │ has_voted
────┼────────────┼────────────────────────┼─────────┼───────┼───────────
 xx │ SCS0000    │ Staff/Teacher Account  │ Faculty │ Admin │ f
```

---

## 🗳️ How Teachers Vote

### Step 1: Go to Voting Page

1. **URL:** `http://localhost:3000`
2. **Enter ID:** `0000` (the system auto-adds "SCS" prefix)
3. **Click:** Continue

### Step 2: Confirm Identity

- Name: `Staff/Teacher Account`
- Class: `Faculty`
- House: `Admin`
- **Click:** Confirm Identity

### Step 3: Vote

**Teachers see:**
- ✅ All 9 school-wide positions
- ✅ ALL 8 house-specific positions (all 4 houses)
- ✅ Badge: 👨‍🏫 Staff (next to their name)

**Teachers do NOT see:**
- ❌ "You have already voted" error

### Step 4: Submit Votes

- Vote for all positions
- Click: **Submit Votes**
- Get: ✅ Success message

### Step 5: Vote Again!

- Logout or refresh
- Enter `0000` again
- Vote again (no restrictions)
- Submit again
- **Repeat as needed!**

---

## 📊 What's Different for Teachers?

### Students:
```
Positions: 8 common + 2 house = 10 total
House voting: Only their own house
Multiple votes: ❌ Blocked
Error message: "You have already voted"
```

### Teachers:
```
Positions: 9 common + 8 house = 17 total
House voting: All 4 houses
Multiple votes: ✅ Allowed
Error message: None (can vote infinite times)
```

---

## 🎓 Available Voting Positions

### School-Wide (9 positions)
Teachers can vote for all:
1. Head Boy
2. Head Girl
3. Deputy Head Boy
4. Deputy Head Girl
5. Sports Captain
6. Sports Vice Captain
7. CCA Captain
8. CCA Vice Captain
9. Cultural Secretary

### House-Specific (8 positions)
Teachers can vote for ALL houses:

**Spartans:**
- Spartans House Captain
- Spartans House Vice Captain

**Vikings:**
- Vikings House Captain
- Vikings House Vice Captain

**Knights:**
- Knights House Captain
- Knights House Vice Captain

**Samurais:**
- Samurais House Captain
- Samurais House Vice Captain

---

## 💾 Database Details

### Teacher Account Fields

```sql
scs_no:    'SCS0000'
name:      'Staff/Teacher Account'
class:     'Faculty'
house:     'Admin'
has_voted: false (stays false even after voting)
```

### How Multiple Voting Works

1. **Student login check:** Detects `SCS0000` → Sets `isTeacher = true`
2. **Voting submission:** Skips `has_voted` check for teachers
3. **Database update:** Does NOT set `has_voted = TRUE` for teachers
4. **Result:** Teacher can vote again immediately

### Vote Registration

When teacher submits votes:
```sql
-- Votes are inserted normally
INSERT INTO votes (student_id, candidate_id, position) VALUES (...)

-- Candidates get votes (same as students)
UPDATE candidates SET vote_count = vote_count + 1

-- Teacher's has_voted status: NO CHANGE (stays false)
-- Students' has_voted status: CHANGED TO TRUE
```

---

## 🔍 Verification Queries

### Check Teacher Account Exists

```sql
SELECT * FROM students WHERE scs_no = 'SCS0000';
```

### Count Votes by Teacher

```sql
-- Votes submitted by teacher
SELECT COUNT(*) as teacher_votes 
FROM votes 
WHERE student_id = (SELECT id FROM students WHERE scs_no = 'SCS0000');
```

### Check Teacher Can Still Vote

```sql
-- Teacher should have has_voted = false
SELECT scs_no, name, has_voted FROM students WHERE scs_no = 'SCS0000';
```

### See All Teacher Voting Activity

```sql
-- Recent votes from teacher
SELECT v.id, v.candidate_id, v.position, v.created_at
FROM votes v
WHERE v.student_id = (SELECT id FROM students WHERE scs_no = 'SCS0000')
ORDER BY v.created_at DESC
LIMIT 20;
```

---

## ❓ Troubleshooting

### Problem: "Student not found" when entering 0000

**Solution:** Make sure you added the teacher account to the database:
```sql
INSERT INTO students (scs_no, name, class, house, has_voted) VALUES
('SCS0000', 'Staff/Teacher Account', 'Faculty', 'Admin', false);
```

### Problem: Teacher gets "You have already voted" error

**Possible causes:**
1. The `isTeacher` flag isn't being set correctly
2. Browser cache - try incognito/private mode
3. Server needs restart

**Solution:**
```bash
# Restart backend
cd backend
npm run start
```

### Problem: Teacher can only see their house positions

**Solution:** Restart backend and re-login:
```bash
# Stop backend (Ctrl+C)
# Restart: npm run start
```

### Problem: Votes not showing in results

**Check:**
```sql
-- Verify votes were recorded
SELECT COUNT(*) as vote_count FROM votes 
WHERE student_id = (SELECT id FROM students WHERE scs_no = 'SCS0000');

-- Check candidate vote counts
SELECT name, position, vote_count FROM candidates ORDER BY vote_count DESC;
```

---

## 📋 Pre-Election Checklist for Teachers

- [ ] Teacher account (`SCS0000`) added to database
- [ ] Test: Can log in with `0000`
- [ ] Test: Can see all 17 positions
- [ ] Test: Can submit votes
- [ ] Test: Can log in again and vote without error
- [ ] Test: Second votes appear in results
- [ ] Brief teachers on how to use `0000`
- [ ] Have IT staff ready for troubleshooting

---

## 🎯 Best Practices

### For Election Day

1. **Before Election Opens:**
   - Verify teacher account exists
   - Test a sample teacher vote
   - Make sure votes were counted

2. **During Election:**
   - Keep voting logs handy
   - Monitor total votes vs expected
   - Teachers can vote throughout day

3. **After Election:**
   - Export results
   - Note: Teacher votes are mixed with student votes (not separated)
   - Verify total vote counts

### For Results

Teacher votes are **counted the same as student votes**:
- ✅ Added to candidate vote counts
- ✅ Appear in results dashboard
- ✅ Included in final tallies

If you need to separate teacher votes later:
```sql
-- Votes from teacher only
SELECT c.name, c.position, COUNT(*) as teacher_votes
FROM votes v
JOIN candidates c ON v.candidate_id = c.id
WHERE v.student_id = (SELECT id FROM students WHERE scs_no = 'SCS0000')
GROUP BY c.id, c.name, c.position;
```

---

## 🔐 Security Notes

1. **Teacher ID is not secret:** `0000` is simple and known
   - This is intentional for easy access
   - Use network security to limit access to school LAN

2. **Vote authenticity:** Any teacher can vote for any candidate
   - Assumes honest voting by faculty
   - Same as paper voting system

3. **Audit trail:** All votes logged with timestamps
   ```sql
   SELECT * FROM audit_logs WHERE action = 'votes_submitted';
   ```

---

## 📞 Summary

| Feature | Student | Teacher |
|---------|---------|---------|
| Login ID | SCS#### | SCS0000 |
| Position count | 10 | 17 |
| House voting | Own house only | All houses |
| Multiple votes | ❌ No | ✅ Yes |
| Vote counted | ✅ Yes | ✅ Yes |
| "Already voted" error | ✅ Yes | ❌ No |

---

**The teacher voting system is now live!** 🎓✨

Teachers can vote multiple times using ID `0000`. Their votes are counted normally in the results.
