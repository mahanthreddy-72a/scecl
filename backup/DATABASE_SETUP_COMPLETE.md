# 📊 Complete Database Setup - All SQL Commands

Copy and paste these commands in pgAdmin to set up your election database completely!

---

## 📋 Table of Contents

1. [Staff/Teacher Accounts](#staffteacher-accounts)
2. [Student Data](#student-data)
3. [Candidates with Images](#candidates-with-images)
4. [Verification Queries](#verification-queries)

---

## 👨‍🏫 Staff/Teacher Accounts

Teachers and staff can vote multiple times using these accounts. Enter `0000` in the SCS field to login.

```sql
-- Basic Staff Account (required)
INSERT INTO students (scs_no, name, class, house, has_voted) VALUES
('SCS0000', 'Staff/Teacher Account', 'Faculty', 'Spartans', false);

-- Optional: Additional Staff Accounts
INSERT INTO students (scs_no, name, class, house, has_voted) VALUES
('SCS0001', 'Principal Account', 'Faculty', 'Spartans', false),
('SCS0002', 'Admin Account', 'Faculty', 'Spartans', false),
('SCS0003', 'Vice Principal Account', 'Faculty', 'Spartans', false);
```

---

## 👥 Student Data

Sample 30 students for testing:

```sql
INSERT INTO students (scs_no, name, class, house, has_voted) VALUES
('SCS1001', 'Aarav Kumar', '10A', 'Spartans', false),
('SCS1002', 'Priya Singh', '10B', 'Vikings', false),
('SCS1003', 'Rohan Patel', '10A', 'Knights', false),
('SCS1004', 'Ananya Sharma', '10B', 'Samurais', false),
('SCS1005', 'Arjun Verma', '11A', 'Spartans', false),
('SCS1006', 'Zara Khan', '11B', 'Vikings', false),
('SCS1007', 'Nikhil Desai', '11A', 'Knights', false),
('SCS1008', 'Diya Iyer', '11B', 'Samurais', false),
('SCS1009', 'Karan Reddy', '12A', 'Spartans', false),
('SCS1010', 'Sneha Gupta', '12B', 'Vikings', false),
('SCS1011', 'Sanjay Kumar', '10A', 'Knights', false),
('SCS1012', 'Pooja Nair', '10B', 'Samurais', false),
('SCS1013', 'Harsh Yadav', '11A', 'Spartans', false),
('SCS1014', 'Isha Chopra', '11B', 'Vikings', false),
('SCS1015', 'Ravi Tiwari', '11A', 'Knights', false),
('SCS1016', 'Anjali Verma', '11B', 'Samurais', false),
('SCS1017', 'Ashok Mehta', '12A', 'Spartans', false),
('SCS1018', 'Varun Singh', '12B', 'Vikings', false),
('SCS1019', 'Sameer Kapoor', '12A', 'Knights', false),
('SCS1020', 'Akshay Kumar', '12B', 'Samurais', false),
('SCS1021', 'Rahul Bhat', '10A', 'Spartans', false),
('SCS1022', 'Siddharth Roy', '10B', 'Vikings', false),
('SCS1023', 'Adnan Khan', '11A', 'Knights', false),
('SCS1024', 'Aditya Sharma', '11B', 'Samurais', false),
('SCS1025', 'Manish Pandey', '12A', 'Spartans', false),
('SCS1026', 'Rishabh Joshi', '12B', 'Vikings', false),
('SCS1027', 'Yash Nambiar', '12A', 'Knights', false),
('SCS1028', 'Aryan Mishra', '12B', 'Samurais', false),
('SCS1029', 'Divyank Srivastava', '10A', 'Spartans', false),
('SCS1030', 'Hari Krishnan', '10B', 'Vikings', false);
```

---

## 🎓 Candidates with Images (.png)

### 1. HEAD BOY (4 candidates)
```sql
INSERT INTO candidates (name, position, image_path) VALUES
('Arun Kumar', 'Head Boy', '/uploads/candidates/head-boy-1.png'),
('Rohan Sharma', 'Head Boy', '/uploads/candidates/head-boy-2.png'),
('Vikram Singh', 'Head Boy', '/uploads/candidates/head-boy-3.png'),
('Arjun Patel', 'Head Boy', '/uploads/candidates/head-boy-4.png');
```

### 2. HEAD GIRL (4 candidates)
```sql
INSERT INTO candidates (name, position, image_path) VALUES
('Priya Singh', 'Head Girl', '/uploads/candidates/head-girl-1.png'),
('Anjali Verma', 'Head Girl', '/uploads/candidates/head-girl-2.png'),
('Sneha Gupta', 'Head Girl', '/uploads/candidates/head-girl-3.png'),
('Diya Iyer', 'Head Girl', '/uploads/candidates/head-girl-4.png');
```

### 3. DEPUTY HEAD BOY (4 candidates)
```sql
INSERT INTO candidates (name, position, image_path) VALUES
('Karan Reddy', 'Deputy Head Boy', '/uploads/candidates/deputy-hb-1.png'),
('Nikhil Desai', 'Deputy Head Boy', '/uploads/candidates/deputy-hb-2.png'),
('Sanjay Kumar', 'Deputy Head Boy', '/uploads/candidates/deputy-hb-3.png'),
('Harsh Yadav', 'Deputy Head Boy', '/uploads/candidates/deputy-hb-4.png');
```

### 4. DEPUTY HEAD GIRL (4 candidates)
```sql
INSERT INTO candidates (name, position, image_path) VALUES
('Zara Khan', 'Deputy Head Girl', '/uploads/candidates/deputy-hg-1.png'),
('Pooja Nair', 'Deputy Head Girl', '/uploads/candidates/deputy-hg-2.png'),
('Isha Chopra', 'Deputy Head Girl', '/uploads/candidates/deputy-hg-3.png'),
('Neha Malhotra', 'Deputy Head Girl', '/uploads/candidates/deputy-hg-4.png');
```

### 5. SPORTS CAPTAIN (4 candidates)
```sql
INSERT INTO candidates (name, position, image_path) VALUES
('Ravi Tiwari', 'Sports Captain', '/uploads/candidates/sports-captain-1.png'),
('Ashok Mehta', 'Sports Captain', '/uploads/candidates/sports-captain-2.png'),
('Varun Singh', 'Sports Captain', '/uploads/candidates/sports-captain-3.png'),
('Sameer Kapoor', 'Sports Captain', '/uploads/candidates/sports-captain-4.png');
```

### 6. SPORTS VICE CAPTAIN (4 candidates)
```sql
INSERT INTO candidates (name, position, image_path) VALUES
('Akshay Kumar', 'Sports Vice Captain', '/uploads/candidates/sports-vc-1.png'),
('Rahul Bhat', 'Sports Vice Captain', '/uploads/candidates/sports-vc-2.png'),
('Siddharth Roy', 'Sports Vice Captain', '/uploads/candidates/sports-vc-3.png'),
('Adnan Khan', 'Sports Vice Captain', '/uploads/candidates/sports-vc-4.png');
```

### 7. CCA CAPTAIN (4 candidates)
```sql
INSERT INTO candidates (name, position, image_path) VALUES
('Aditya Sharma', 'CCA Captain', '/uploads/candidates/cca-captain-1.png'),
('Manish Pandey', 'CCA Captain', '/uploads/candidates/cca-captain-2.png'),
('Rishabh Joshi', 'CCA Captain', '/uploads/candidates/cca-captain-3.png'),
('Yash Nambiar', 'CCA Captain', '/uploads/candidates/cca-captain-4.png');
```

### 8. CCA VICE CAPTAIN (4 candidates)
```sql
INSERT INTO candidates (name, position, image_path) VALUES
('Aryan Mishra', 'CCA Vice Captain', '/uploads/candidates/cca-vc-1.png'),
('Divyank Srivastava', 'CCA Vice Captain', '/uploads/candidates/cca-vc-2.png'),
('Hari Krishnan', 'CCA Vice Captain', '/uploads/candidates/cca-vc-3.png'),
('Jatin Kumar', 'CCA Vice Captain', '/uploads/candidates/cca-vc-4.png');
```

### 9. CULTURAL SECRETARY (4 candidates)
```sql
INSERT INTO candidates (name, position, image_path) VALUES
('Ananya Das', 'Cultural Secretary', '/uploads/candidates/cultural-sec-1.png'),
('Bhavna Sharma', 'Cultural Secretary', '/uploads/candidates/cultural-sec-2.png'),
('Chandni Saxena', 'Cultural Secretary', '/uploads/candidates/cultural-sec-3.png'),
('Deepa Menon', 'Cultural Secretary', '/uploads/candidates/cultural-sec-4.png');
```

### 10. SPARTANS HOUSE CAPTAIN (4 candidates)
```sql
INSERT INTO candidates (name, position, house, image_path) VALUES
('Arjun Reddy', 'Spartans House Captain', 'Spartans', '/uploads/candidates/spartans-captain-1.png'),
('Bhavesh Patel', 'Spartans House Captain', 'Spartans', '/uploads/candidates/spartans-captain-2.png'),
('Chirag Nair', 'Spartans House Captain', 'Spartans', '/uploads/candidates/spartans-captain-3.png'),
('Devendra Singh', 'Spartans House Captain', 'Spartans', '/uploads/candidates/spartans-captain-4.png');
```

### 11. SPARTANS HOUSE VICE CAPTAIN (4 candidates)
```sql
INSERT INTO candidates (name, position, house, image_path) VALUES
('Esha Gupta', 'Spartans House Vice Captain', 'Spartans', '/uploads/candidates/spartans-vc-1.png'),
('Falak Khan', 'Spartans House Vice Captain', 'Spartans', '/uploads/candidates/spartans-vc-2.png'),
('Gauri Sharma', 'Spartans House Vice Captain', 'Spartans', '/uploads/candidates/spartans-vc-3.png'),
('Hema Verma', 'Spartans House Vice Captain', 'Spartans', '/uploads/candidates/spartans-vc-4.png');
```

### 12. VIKINGS HOUSE CAPTAIN (4 candidates)
```sql
INSERT INTO candidates (name, position, house, image_path) VALUES
('Ishan Kapoor', 'Vikings House Captain', 'Vikings', '/uploads/candidates/vikings-captain-1.png'),
('Javed Khan', 'Vikings House Captain', 'Vikings', '/uploads/candidates/vikings-captain-2.png'),
('Kabir Singh', 'Vikings House Captain', 'Vikings', '/uploads/candidates/vikings-captain-3.png'),
('Lokesh Rao', 'Vikings House Captain', 'Vikings', '/uploads/candidates/vikings-captain-4.png');
```

### 13. VIKINGS HOUSE VICE CAPTAIN (4 candidates)
```sql
INSERT INTO candidates (name, position, house, image_path) VALUES
('Maya Desai', 'Vikings House Vice Captain', 'Vikings', '/uploads/candidates/vikings-vc-1.png'),
('Nisha Iyer', 'Vikings House Vice Captain', 'Vikings', '/uploads/candidates/vikings-vc-2.png'),
('Opal Chopra', 'Vikings House Vice Captain', 'Vikings', '/uploads/candidates/vikings-vc-3.png'),
('Priya Nair', 'Vikings House Vice Captain', 'Vikings', '/uploads/candidates/vikings-vc-4.png');
```

### 14. KNIGHTS HOUSE CAPTAIN (4 candidates)
```sql
INSERT INTO candidates (name, position, house, image_path) VALUES
('Qasim Ahmed', 'Knights House Captain', 'Knights', '/uploads/candidates/knights-captain-1.png'),
('Rishi Kumar', 'Knights House Captain', 'Knights', '/uploads/candidates/knights-captain-2.png'),
('Sarthak Malhotra', 'Knights House Captain', 'Knights', '/uploads/candidates/knights-captain-3.png'),
('Tanmay Bhat', 'Knights House Captain', 'Knights', '/uploads/candidates/knights-captain-4.png');
```

### 15. KNIGHTS HOUSE VICE CAPTAIN (4 candidates)
```sql
INSERT INTO candidates (name, position, house, image_path) VALUES
('Ushma Saxena', 'Knights House Vice Captain', 'Knights', '/uploads/candidates/knights-vc-1.png'),
('Varada Rao', 'Knights House Vice Captain', 'Knights', '/uploads/candidates/knights-vc-2.png'),
('Wanda Pereira', 'Knights House Vice Captain', 'Knights', '/uploads/candidates/knights-vc-3.png'),
('Ximena Silva', 'Knights House Vice Captain', 'Knights', '/uploads/candidates/knights-vc-4.png');
```

### 16. SAMURAIS HOUSE CAPTAIN (4 candidates)
```sql
INSERT INTO candidates (name, position, house, image_path) VALUES
('Yusuf Khan', 'Samurais House Captain', 'Samurais', '/uploads/candidates/samurais-captain-1.png'),
('Zain Ahmed', 'Samurais House Captain', 'Samurais', '/uploads/candidates/samurais-captain-2.png'),
('Abhinav Verma', 'Samurais House Captain', 'Samurais', '/uploads/candidates/samurais-captain-3.png'),
('Balraj Singh', 'Samurais House Captain', 'Samurais', '/uploads/candidates/samurais-captain-4.png');
```

### 17. SAMURAIS HOUSE VICE CAPTAIN (4 candidates)
```sql
INSERT INTO candidates (name, position, house, image_path) VALUES
('Chhavi Sharma', 'Samurais House Vice Captain', 'Samurais', '/uploads/candidates/samurais-vc-1.png'),
('Disha Iyer', 'Samurais House Vice Captain', 'Samurais', '/uploads/candidates/samurais-vc-2.png'),
('Esha Verma', 'Samurais House Vice Captain', 'Samurais', '/uploads/candidates/samurais-vc-3.png'),
('Farida Khan', 'Samurais House Vice Captain', 'Samurais', '/uploads/candidates/samurais-vc-4.png');
```

---

## ✅ Verification Queries

After adding all data, run these to verify:

```sql
-- Count total staff accounts
SELECT COUNT(*) as staff_count FROM students WHERE scs_no LIKE 'SCS000%';

-- Count total students
SELECT COUNT(*) as total_students FROM students;

-- Count total candidates
SELECT COUNT(*) as total_candidates FROM candidates;

-- Verify candidates by position
SELECT position, COUNT(*) as count FROM candidates GROUP BY position;

-- Check image paths exist
SELECT COUNT(*) as candidates_with_images FROM candidates WHERE image_path IS NOT NULL;

-- View all staff accounts
SELECT scs_no, name, class FROM students WHERE scs_no LIKE 'SCS000%';
```

---

## 📝 Setup Steps

1. **Delete all existing data** (optional):
   ```sql
   DELETE FROM activity_logs;
   DELETE FROM votes;
   DELETE FROM candidates;
   DELETE FROM students;
   ```

2. **Add staff accounts** - Copy and paste from Staff/Teacher Accounts section

3. **Add students** - Copy and paste from Student Data section

4. **Add candidates** - Copy and paste each position section one by one

5. **Verify** - Run the verification queries

---

## 📊 Summary

- **Staff Accounts:** 1-4 (for multiple voting)
- **Students:** 30 (for testing)
- **Candidates:** 68 (4 per position × 17 positions)
- **Positions:** 17 (9 school-wide + 8 house-specific)
- **Image Format:** PNG (.png)
- **Image Path Pattern:** `/uploads/candidates/{position-slug}-{number}.png`

---

## 🎯 Image Files Required

You need to add these image files to `backend/uploads/candidates/`:

- `head-boy-1.png` through `head-boy-4.png`
- `head-girl-1.png` through `head-girl-4.png`
- `deputy-hb-1.png` through `deputy-hb-4.png`
- `deputy-hg-1.png` through `deputy-hg-4.png`
- `sports-captain-1.png` through `sports-captain-4.png`
- `sports-vc-1.png` through `sports-vc-4.png`
- `cca-captain-1.png` through `cca-captain-4.png`
- `cca-vc-1.png` through `cca-vc-4.png`
- `cultural-sec-1.png` through `cultural-sec-4.png`
- `spartans-captain-1.png` through `spartans-captain-4.png`
- `spartans-vc-1.png` through `spartans-vc-4.png`
- `vikings-captain-1.png` through `vikings-captain-4.png`
- `vikings-vc-1.png` through `vikings-vc-4.png`
- `knights-captain-1.png` through `knights-captain-4.png`
- `knights-vc-1.png` through `knights-vc-4.png`
- `samurais-captain-1.png` through `samurais-captain-4.png`
- `samurais-vc-1.png` through `samurais-vc-4.png`

**Total: 68 image files needed**

---

## 🚀 Ready to Go!

Your database is now set up with:
- ✅ Staff accounts for multiple voting
- ✅ 30 test students
- ✅ 68 candidates across 17 positions
- ✅ Image paths for all candidates

**Login as staff:** Use `0000` in SCS field 🎓
**Login as student:** Use any SCS number (1001-1030) 🗳️
