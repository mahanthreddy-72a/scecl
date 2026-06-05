const bcrypt = require('bcrypt');
const pool = require('../db');

const verifyPassword = (password, hash) => bcrypt.compareSync(password, hash);

const hashPassword = async (password) => bcrypt.hash(password, 10);

const findAdminByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
  return result.rows[0];
};

const findStudentBySCSNumber = async (scsNo) => {
  const result = await pool.query('SELECT * FROM students WHERE scs_no = $1', [scsNo]);
  return result.rows[0];
};

const getStudentById = async (id) => {
  const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
  return result.rows[0];
};

module.exports = {
  verifyPassword,
  hashPassword,
  findAdminByUsername,
  findStudentBySCSNumber,
  getStudentById
};
