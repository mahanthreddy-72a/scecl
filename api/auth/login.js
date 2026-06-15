require('dotenv').config({ path: '../.env' });

const pool = require('../../backend/src/db');
const bcrypt = require('bcrypt');

const verifyPassword = (password, hash) => bcrypt.compareSync(password, hash);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { scs_no } = req.body;

    if (!scs_no) {
      return res.status(400).json({ error: 'SCS number required' });
    }

    const result = await pool.query('SELECT * FROM students WHERE scs_no = $1', [scs_no]);
    const student = result.rows[0];

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const isTeacher = scs_no === '0000' || scs_no === 'SCS0000';

    if (!isTeacher && student.has_voted) {
      return res.status(403).json({ error: 'You have already voted' });
    }

    res.status(200).json({
      success: true,
      student: {
        id: student.id,
        scs_no: student.scs_no,
        name: student.name,
        class: student.class,
        house: student.house,
        hasVoted: student.has_voted,
        isTeacher: isTeacher
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Login failed' });
  }
}
