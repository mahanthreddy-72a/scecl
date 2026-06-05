const requireAdmin = (req, res, next) => {
  if (!req.session.adminId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

const requireStudent = (req, res, next) => {
  if (!req.session.studentId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

module.exports = {
  requireAdmin,
  requireStudent
};
