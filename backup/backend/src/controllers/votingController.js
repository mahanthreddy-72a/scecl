const pool = require('../db');
const { log } = require('../utils/audit');

exports.submitVotes = async (req, res) => {
  const client = await pool.connect();
  try {
    const studentId = req.session.studentId;
    const isTeacher = req.session.isTeacher || false;
    const votes = req.body.votes;

    if (!studentId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!Array.isArray(votes) || votes.length === 0) {
      return res.status(400).json({ error: 'No votes provided' });
    }

    const studentRes = await client.query('SELECT * FROM students WHERE id = $1', [studentId]);
    const student = studentRes.rows[0];

    // Skip has_voted check for teachers
    if (!isTeacher && student.has_voted) {
      return res.status(403).json({ error: 'You have already voted' });
    }

    const houses = ['Spartans', 'Vikings', 'Knights', 'Samurais'];
    const validPositions = [
      'Head Boy',
      'Head Girl',
      'Deputy Head Boy',
      'Deputy Head Girl',
      'Sports Captain',
      'Sports Vice Captain',
      'CCA Captain',
      'CCA Vice Captain',
      'Cultural Secretary',
      ...houses.map(h => `${h} House Captain`),
      ...houses.map(h => `${h} House Vice Captain`)
    ];

    for (const vote of votes) {
      if (!vote.position || !vote.candidateId) {
        return res.status(400).json({ error: 'Invalid vote data' });
      }

      if (!validPositions.includes(vote.position)) {
        return res.status(400).json({ error: 'Invalid position' });
      }

      const candRes = await client.query('SELECT * FROM candidates WHERE id = $1', [vote.candidateId]);
      if (candRes.rows.length === 0) {
        return res.status(400).json({ error: 'Candidate not found' });
      }
    }

    await client.query('BEGIN');

    try {
      for (const vote of votes) {
        await client.query(
          'INSERT INTO votes (student_id, candidate_id, position) VALUES ($1, $2, $3)',
          [studentId, vote.candidateId, vote.position]
        );
        await client.query(
          'UPDATE candidates SET vote_count = vote_count + 1 WHERE id = $1',
          [vote.candidateId]
        );
      }

      // Only mark as voted if not a teacher (teachers can vote multiple times)
      if (!isTeacher) {
        await client.query(
          'UPDATE students SET has_voted = TRUE WHERE id = $1',
          [studentId]
        );
      }

      await client.query('COMMIT');

      await log('votes_submitted', 'student', studentId, { voteCount: votes.length, isTeacher });

      res.json({ success: true, message: 'Your votes have been submitted successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Vote submission error:', error);
    res.status(500).json({ error: 'Failed to submit votes' });
  } finally {
    client.release();
  }
};

exports.getCandidatesByPosition = async (req, res) => {
  try {
    const { position } = req.params;
    const studentId = req.session.studentId;

    if (!studentId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const studentRes = await pool.query('SELECT house FROM students WHERE id = $1', [studentId]);
    const student = studentRes.rows[0];

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    let result;
    const houses = ['Spartans', 'Vikings', 'Knights', 'Samurais'];
    const isHousePosition = houses.some(h => position.includes(h));

    if (isHousePosition) {
      // For house-specific positions (e.g., "Spartans House Captain")
      result = await pool.query(
        `SELECT id, name, position, house, image_path
         FROM candidates
         WHERE position = $1
         ORDER BY name ASC`,
        [position]
      );
    } else {
      // For common positions (e.g., "Head Boy")
      result = await pool.query(
        `SELECT id, name, position, house, image_path
         FROM candidates
         WHERE position = $1
         ORDER BY name ASC`,
        [position]
      );
    }

    res.json({ candidates: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load candidates' });
  }
};

exports.getAllPositions = async (req, res) => {
  try {
    const studentId = req.session.studentId;
    const isTeacher = req.session.isTeacher || false;

    if (!studentId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const studentRes = await pool.query('SELECT house FROM students WHERE id = $1', [studentId]);
    const student = studentRes.rows[0];

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const positions = [
      // School-wide positions (9)
      { name: 'Head Boy', common: true },
      { name: 'Head Girl', common: true },
      { name: 'Deputy Head Boy', common: true },
      { name: 'Deputy Head Girl', common: true },
      { name: 'Sports Captain', common: true },
      { name: 'Sports Vice Captain', common: true },
      { name: 'CCA Captain', common: true },
      { name: 'CCA Vice Captain', common: true },
      { name: 'Cultural Secretary', common: true }
    ];

    // Teachers can vote for all house positions
    if (isTeacher) {
      const houses = ['Spartans', 'Vikings', 'Knights', 'Samurais'];
      for (const house of houses) {
        positions.push({ name: `${house} House Captain`, common: false, house });
        positions.push({ name: `${house} House Vice Captain`, common: false, house });
      }
    } else {
      // Regular students only vote for their own house
      positions.push({ name: `${student.house} House Captain`, common: false, house: student.house });
      positions.push({ name: `${student.house} House Vice Captain`, common: false, house: student.house });
    }

    res.json({ positions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load positions' });
  }
};

exports.logActivity = async (req, res) => {
  try {
    const studentId = req.session.studentId;
    const { status } = req.body;

    if (!studentId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!['logged_in', 'viewing_ballot', 'voting', 'submitted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await pool.query(
      'INSERT INTO activity_logs (student_id, status) VALUES ($1, $2)',
      [studentId, status]
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
};
