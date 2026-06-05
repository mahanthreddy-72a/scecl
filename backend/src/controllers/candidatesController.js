const db = require('../db');
const { log } = require('../utils/audit');
const path = require('path');
const fs = require('fs');

exports.getAllCandidates = (req, res) => {
  const candidates = db.prepare(`
    SELECT id, name, position, house, image_path, vote_count, created_at
    FROM candidates
    ORDER BY position ASC, name ASC
  `).all();

  res.json({ candidates });
};

exports.getCandidateById = (req, res) => {
  const { id } = req.params;

  const candidate = db.prepare(`
    SELECT * FROM candidates WHERE id = ?
  `).get(id);

  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  res.json({ candidate });
};

exports.createCandidate = (req, res) => {
  const { name, position, house } = req.body;

  if (!name || !position) {
    return res.status(400).json({ error: 'Name and position required' });
  }

  const validPositions = [
    'Head Boy',
    'Head Girl',
    'Sports Captain',
    'Cultural Secretary',
    'House Captain',
    'House Vice Captain'
  ];

  if (!validPositions.includes(position)) {
    return res.status(400).json({ error: 'Invalid position' });
  }

  if (house && !['Spartans', 'Vikings', 'Knights', 'Samurais'].includes(house)) {
    return res.status(400).json({ error: 'Invalid house' });
  }

  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/candidates/${req.file.filename}`;
  }

  const stmt = db.prepare(`
    INSERT INTO candidates (name, position, house, image_path)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(name, position, house || null, imagePath);

  log('candidate_created', 'candidate', result.lastInsertRowid, { name, position, house });

  res.status(201).json({
    success: true,
    candidate: {
      id: result.lastInsertRowid,
      name,
      position,
      house: house || null,
      image_path: imagePath
    }
  });
};

exports.updateCandidate = (req, res) => {
  const { id } = req.params;
  const { name, position, house } = req.body;

  const candidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id);

  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  let imagePath = candidate.image_path;
  if (req.file) {
    // Delete old image if exists
    if (candidate.image_path) {
      const oldPath = path.join(__dirname, '../../uploads/candidates', path.basename(candidate.image_path));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    imagePath = `/uploads/candidates/${req.file.filename}`;
  }

  const stmt = db.prepare(`
    UPDATE candidates
    SET name = ?, position = ?, house = ?, image_path = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(name || candidate.name, position || candidate.position, house || candidate.house, imagePath, id);

  log('candidate_updated', 'candidate', id, { name, position, house });

  res.json({
    success: true,
    candidate: {
      id,
      name: name || candidate.name,
      position: position || candidate.position,
      house: house || candidate.house,
      image_path: imagePath
    }
  });
};

exports.deleteCandidate = (req, res) => {
  const { id } = req.params;

  const candidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id);

  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  // Delete image file if exists
  if (candidate.image_path) {
    const imagePath = path.join(__dirname, '../../uploads/candidates', path.basename(candidate.image_path));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  db.prepare('DELETE FROM candidates WHERE id = ?').run(id);

  log('candidate_deleted', 'candidate', id, { name: candidate.name });

  res.json({ success: true, message: 'Candidate deleted' });
};
