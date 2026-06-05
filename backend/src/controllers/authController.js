const { verifyPassword, findAdminByUsername, findStudentBySCSNumber, getStudentById } = require('../utils/auth');
const { log } = require('../utils/audit');
const db = require('../db');

exports.adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const admin = findAdminByUsername(username);

  if (!admin || !verifyPassword(password, admin.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.adminId = admin.id;
  log('admin_login', 'admin', admin.id, { username });

  res.json({ success: true, admin: { id: admin.id, username: admin.username } });
};

exports.adminLogout = (req, res) => {
  const adminId = req.session.adminId;
  req.session.destroy();
  if (adminId) {
    log('admin_logout', 'admin', adminId, {});
  }
  res.json({ success: true });
};

exports.studentLogin = (req, res) => {
  const { scs_no } = req.body;

  if (!scs_no) {
    return res.status(400).json({ error: 'SCS number required' });
  }

  const student = findStudentBySCSNumber(scs_no);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  if (student.has_voted) {
    return res.status(403).json({ error: 'You have already voted' });
  }

  req.session.studentId = student.id;

  db.prepare('UPDATE students SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(student.id);
  log('student_login', 'student', student.id, { scs_no });

  res.json({
    success: true,
    student: {
      id: student.id,
      name: student.name,
      scs_no: student.scs_no,
      class: student.class,
      house: student.house
    }
  });
};

exports.studentLogout = (req, res) => {
  const studentId = req.session.studentId;
  req.session.destroy();
  if (studentId) {
    log('student_logout', 'student', studentId, {});
  }
  res.json({ success: true });
};

exports.getAdminStatus = (req, res) => {
  if (!req.session.adminId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const admin = db.prepare('SELECT id, username FROM admins WHERE id = ?').get(req.session.adminId);
  res.json({ admin });
};

exports.getStudentStatus = (req, res) => {
  if (!req.session.studentId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const student = getStudentById(req.session.studentId);
  res.json({
    student: {
      id: student.id,
      name: student.name,
      scs_no: student.scs_no,
      class: student.class,
      house: student.house,
      has_voted: student.has_voted
    }
  });
};
