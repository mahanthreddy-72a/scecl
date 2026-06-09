const { verifyPassword, findAdminByUsername, findStudentBySCSNumber, getStudentById } = require('../utils/auth');
const { log } = require('../utils/audit');
const pool = require('../db');

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const admin = await findAdminByUsername(username);

    if (!admin || !verifyPassword(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.adminId = admin.id;
    await log('admin_login', 'admin', admin.id, { username });

    res.json({ success: true, admin: { id: admin.id, username: admin.username } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.adminLogout = async (req, res) => {
  try {
    const adminId = req.session.adminId;
    req.session.destroy((err) => {
      if (adminId) {
        log('admin_logout', 'admin', adminId, {});
      }
      res.json({ success: true });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

exports.studentLogin = async (req, res) => {
  try {
    const { scs_no } = req.body;

    if (!scs_no) {
      return res.status(400).json({ error: 'SCS number required' });
    }

    // Check if it's a teacher/staff ID (0000 or SCS0000)
    const isTeacher = scs_no === '0000' || scs_no === 'SCS0000';

    const student = await findStudentBySCSNumber(scs_no);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Skip has_voted check for teachers
    if (!isTeacher && student.has_voted) {
      return res.status(403).json({ error: 'You have already voted' });
    }

    req.session.studentId = student.id;
    req.session.isTeacher = isTeacher;

    await pool.query('UPDATE students SET last_login = NOW() WHERE id = $1', [student.id]);
    await log('student_login', 'student', student.id, { scs_no, isTeacher });

    res.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        scs_no: student.scs_no,
        class: student.class,
        house: student.house,
        isTeacher
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.studentLogout = async (req, res) => {
  try {
    const studentId = req.session.studentId;
    req.session.destroy((err) => {
      if (studentId) {
        log('student_logout', 'student', studentId, {});
      }
      res.json({ success: true });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

exports.getAdminStatus = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const result = await pool.query('SELECT id, username FROM admins WHERE id = $1', [req.session.adminId]);
    const admin = result.rows[0];

    res.json({ admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Status check failed' });
  }
};

exports.getStudentStatus = async (req, res) => {
  try {
    if (!req.session.studentId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const isTeacher = req.session.isTeacher || false;
    const student = await getStudentById(req.session.studentId);

    res.json({
      student: {
        id: student.id,
        name: student.name,
        scs_no: student.scs_no,
        class: student.class,
        house: student.house,
        has_voted: student.has_voted,
        isTeacher
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Status check failed' });
  }
};
