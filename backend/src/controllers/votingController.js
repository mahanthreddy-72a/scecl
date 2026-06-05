const db = require('../db');
const { log } = require('../utils/audit');

exports.submitVotes = (req, res) => {
  const studentId = req.session.studentId;
  const votes = req.body.votes; // Array of { position, candidateId }

  if (!studentId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (!Array.isArray(votes) || votes.length === 0) {
    return res.status(400).json({ error: 'No votes provided' });
  }

  try {
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(studentId);

    if (student.has_voted) {
      return res.status(403).json({ error: 'You have already voted' });
    }

    // Validate all votes
    const validPositions = [
      'Head Boy',
      'Head Girl',
      'Sports Captain',
      'Cultural Secretary',
      'House Captain',
      'House Vice Captain'
    ];

    for (const vote of votes) {
      if (!vote.position || !vote.candidateId) {
        return res.status(400).json({ error: 'Invalid vote data' });
      }

      if (!validPositions.includes(vote.position)) {
        return res.status(400).json({ error: 'Invalid position' });
      }

      const candidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(vote.candidateId);
      if (!candidate) {
        return res.status(400).json({ error: 'Candidate not found' });
      }
    }

    // Begin transaction
    const insertVote = db.prepare(`
      INSERT INTO votes (student_id, candidate_id, position)
      VALUES (?, ?, ?)
    `);

    const updateCandidate = db.prepare(`
      UPDATE candidates SET vote_count = vote_count + 1 WHERE id = ?
    `);

    const updateStudent = db.prepare(`
      UPDATE students SET has_voted = 1 WHERE id = ?
    `);

    const transaction = db.transaction(() => {
      for (const vote of votes) {
        insertVote.run(studentId, vote.candidateId, vote.position);
        updateCandidate.run(vote.candidateId);
      }
      updateStudent.run(studentId);
    });

    transaction();

    log('votes_submitted', 'student', studentId, { voteCount: votes.length });

    res.json({ success: true, message: 'Your votes have been submitted successfully' });
  } catch (error) {
    console.error('Vote submission error:', error);
    res.status(500).json({ error: 'Failed to submit votes' });
  }
};

exports.getCandidatesByPosition = (req, res) => {
  const { position } = req.params;
  const studentId = req.session.studentId;

  if (!studentId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const student = db.prepare('SELECT house FROM students WHERE id = ?').get(studentId);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  let candidates;

  if (position === 'House Captain' || position === 'House Vice Captain') {
    candidates = db.prepare(`
      SELECT id, name, position, house, image_path
      FROM candidates
      WHERE position = ? AND house = ?
      ORDER BY name ASC
    `).all(position, student.house);
  } else {
    candidates = db.prepare(`
      SELECT id, name, position, house, image_path
      FROM candidates
      WHERE position = ? AND house IS NULL
      ORDER BY name ASC
    `).all(position);
  }

  res.json({ candidates });
};

exports.getAllPositions = (req, res) => {
  const studentId = req.session.studentId;

  if (!studentId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const student = db.prepare('SELECT house FROM students WHERE id = ?').get(studentId);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const positions = [
    { name: 'Head Boy', common: true },
    { name: 'Head Girl', common: true },
    { name: 'Sports Captain', common: true },
    { name: 'Cultural Secretary', common: true },
    { name: 'House Captain', common: false, house: student.house },
    { name: 'House Vice Captain', common: false, house: student.house }
  ];

  res.json({ positions });
};

exports.logActivity = (req, res) => {
  const studentId = req.session.studentId;
  const { status } = req.body;

  if (!studentId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (!['logged_in', 'viewing_ballot', 'voting', 'submitted'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.prepare(`
    INSERT INTO activity_logs (student_id, status)
    VALUES (?, ?)
  `).run(studentId, status);

  res.json({ success: true });
};
