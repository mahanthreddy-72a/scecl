const pool = require('../db');
const { log } = require('../utils/audit');
const path = require('path');
const fs = require('fs');

exports.getAllCandidates = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, position, house, image_path, vote_count, created_at
      FROM candidates
      ORDER BY position ASC, name ASC
    `);
    res.json({ candidates: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load candidates' });
  }
};

exports.getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM candidates WHERE id = $1', [id]);
    const candidate = result.rows[0];

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json({ candidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load candidate' });
  }
};

exports.createCandidate = async (req, res) => {
  try {
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

    const result = await pool.query(
      `INSERT INTO candidates (name, position, house, image_path)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, position, house || null, imagePath]
    );

    const candidate = result.rows[0];
    await log('candidate_created', 'candidate', candidate.id, { name, position, house });

    res.status(201).json({
      success: true,
      candidate: {
        id: candidate.id,
        name: candidate.name,
        position: candidate.position,
        house: candidate.house,
        image_path: candidate.image_path
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create candidate' });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, house } = req.body;

    const candRes = await pool.query('SELECT * FROM candidates WHERE id = $1', [id]);
    const candidate = candRes.rows[0];

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    let imagePath = candidate.image_path;
    if (req.file) {
      if (candidate.image_path) {
        const oldPath = path.join(__dirname, '../../uploads/candidates', path.basename(candidate.image_path));
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      imagePath = `/uploads/candidates/${req.file.filename}`;
    }

    const result = await pool.query(
      `UPDATE candidates
       SET name = $1, position = $2, house = $3, image_path = $4, updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [name || candidate.name, position || candidate.position, house || candidate.house, imagePath, id]
    );

    const updated = result.rows[0];
    await log('candidate_updated', 'candidate', id, { name, position, house });

    res.json({
      success: true,
      candidate: {
        id: updated.id,
        name: updated.name,
        position: updated.position,
        house: updated.house,
        image_path: updated.image_path
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candRes = await pool.query('SELECT * FROM candidates WHERE id = $1', [id]);
    const candidate = candRes.rows[0];

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    if (candidate.image_path) {
      const imagePath = path.join(__dirname, '../../uploads/candidates', path.basename(candidate.image_path));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await pool.query('DELETE FROM candidates WHERE id = $1', [id]);
    await log('candidate_deleted', 'candidate', id, { name: candidate.name });

    res.json({ success: true, message: 'Candidate deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
};
