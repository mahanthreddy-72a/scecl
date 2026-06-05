const bcrypt = require('bcrypt');
const db = require('../db');

const verifyPassword = (password, hash) => bcrypt.compareSync(password, hash);

const hashPassword = async (password) => bcrypt.hash(password, 10);

const findAdminByUsername = (username) => {
  return db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
};

const findStudentBySCSNumber = (scsNo) => {
  return db.prepare('SELECT * FROM students WHERE scs_no = ?').get(scsNo);
};

const getStudentById = (id) => {
  return db.prepare('SELECT * FROM students WHERE id = ?').get(id);
};

module.exports = {
  verifyPassword,
  hashPassword,
  findAdminByUsername,
  findStudentBySCSNumber,
  getStudentById
};
