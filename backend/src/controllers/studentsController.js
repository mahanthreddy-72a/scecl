const db = require('../db');
const { log } = require('../utils/audit');
const XLSX = require('xlsx');
const csv = require('csv-parse/sync');
const fs = require('fs');

exports.getAllStudents = (req, res) => {
  const { page = 1, limit = 20, search } = req.query;

  let query = 'SELECT id, scs_no, name, class, house, has_voted, last_login FROM students';
  const params = [];

  if (search) {
    query += ' WHERE scs_no LIKE ? OR name LIKE ? OR class LIKE ?';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY scs_no ASC LIMIT ? OFFSET ?';

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  params.push(limitNum, offset);

  const students = db.prepare(query).all(...params);

  const countQuery = 'SELECT COUNT(*) as total FROM students' + (search ? ' WHERE scs_no LIKE ? OR name LIKE ? OR class LIKE ?' : '');
  const countParams = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [];
  const { total } = db.prepare(countQuery).get(...countParams);

  res.json({
    students,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
};

exports.getStudentById = (req, res) => {
  const { id } = req.params;

  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json({ student });
};

exports.createStudent = (req, res) => {
  const { scs_no, name, class: cls, house } = req.body;

  if (!scs_no || !name || !cls || !house) {
    return res.status(400).json({ error: 'All fields required' });
  }

  if (!['Spartans', 'Vikings', 'Knights', 'Samurais'].includes(house)) {
    return res.status(400).json({ error: 'Invalid house' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO students (scs_no, name, class, house)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(scs_no, name, cls, house);

    log('student_created', 'student', result.lastInsertRowid, { scs_no, name, cls, house });

    res.status(201).json({
      success: true,
      student: {
        id: result.lastInsertRowid,
        scs_no,
        name,
        class: cls,
        house,
        has_voted: 0
      }
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Student with this SCS number already exists' });
    }
    throw error;
  }
};

exports.updateStudent = (req, res) => {
  const { id } = req.params;
  const { name, class: cls, house } = req.body;

  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  if (house && !['Spartans', 'Vikings', 'Knights', 'Samurais'].includes(house)) {
    return res.status(400).json({ error: 'Invalid house' });
  }

  const stmt = db.prepare(`
    UPDATE students
    SET name = ?, class = ?, house = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(name || student.name, cls || student.class, house || student.house, id);

  log('student_updated', 'student', id, { name, class: cls, house });

  res.json({
    success: true,
    student: {
      id,
      scs_no: student.scs_no,
      name: name || student.name,
      class: cls || student.class,
      house: house || student.house,
      has_voted: student.has_voted
    }
  });
};

exports.deleteStudent = (req, res) => {
  const { id } = req.params;

  const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  db.prepare('DELETE FROM students WHERE id = ?').run(id);

  log('student_deleted', 'student', id, { scs_no: student.scs_no });

  res.json({ success: true, message: 'Student deleted' });
};

exports.bulkImport = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    let rows = [];

    if (req.file.originalname.endsWith('.xlsx')) {
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (req.file.originalname.endsWith('.csv')) {
      const content = req.file.buffer.toString('utf-8');
      rows = csv.parse(content, {
        columns: true,
        skip_empty_lines: true
      });
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Use CSV or XLSX.' });
    }

    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: 'File is empty' });
    }

    const stmt = db.prepare(`
      INSERT INTO students (scs_no, name, class, house)
      VALUES (?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      let imported = 0;
      let skipped = 0;

      for (const row of rows) {
        const scs_no = String(row.scs_no || row.SCS_NO || row.SCS).trim();
        const name = String(row.name || row.NAME || '').trim();
        const cls = String(row.class || row.CLASS || row.Class || '').trim();
        const house = String(row.house || row.HOUSE || row.House || '').trim();

        if (!scs_no || !name || !cls || !house) {
          skipped++;
          continue;
        }

        if (!['Spartans', 'Vikings', 'Knights', 'Samurais'].includes(house)) {
          skipped++;
          continue;
        }

        try {
          stmt.run(scs_no, name, cls, house);
          imported++;
        } catch (error) {
          // Skip duplicates
          skipped++;
        }
      }

      return { imported, skipped };
    });

    const result = transaction();

    log('students_imported', 'bulk_import', null, result);

    res.json({
      success: true,
      message: `Imported ${result.imported} students, skipped ${result.skipped}`,
      imported: result.imported,
      skipped: result.skipped
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import students' });
  }
};
