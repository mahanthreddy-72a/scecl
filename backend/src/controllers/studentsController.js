const pool = require('../db');
const { log } = require('../utils/audit');
const XLSX = require('xlsx');
const csv = require('csv-parse/sync');

exports.getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = 'SELECT id, scs_no, name, class, house, has_voted, last_login FROM students';
    const params = [];

    if (search) {
      query += ' WHERE scs_no ILIKE $1 OR name ILIKE $1 OR class ILIKE $1';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY scs_no ASC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limitNum, offset);

    const [studentsRes, countRes] = await Promise.all([
      pool.query(query, params),
      pool.query(
        'SELECT COUNT(*) as total FROM students' +
        (search ? ' WHERE scs_no ILIKE $1 OR name ILIKE $1 OR class ILIKE $1' : ''),
        search ? [`%${search}%`] : []
      )
    ]);

    const total = parseInt(countRes.rows[0].total);

    res.json({
      students: studentsRes.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load students' });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    const student = result.rows[0];

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load student' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { scs_no, name, class: cls, house } = req.body;

    if (!scs_no || !name || !cls || !house) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Validate SCS number: must be numeric and minimum 4 digits
    if (!/^\d{4,}$/.test(scs_no)) {
      return res.status(400).json({ error: 'SCS number must be at least 4 digits (numeric only)' });
    }

    if (!['Spartans', 'Vikings', 'Knights', 'Samurais'].includes(house)) {
      return res.status(400).json({ error: 'Invalid house' });
    }

    const result = await pool.query(
      `INSERT INTO students (scs_no, name, class, house)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [scs_no, name, cls, house]
    );

    const student = result.rows[0];
    await log('student_created', 'student', student.id, { scs_no, name, cls, house });

    res.status(201).json({
      success: true,
      student: {
        id: student.id,
        scs_no: student.scs_no,
        name: student.name,
        class: student.class,
        house: student.house,
        has_voted: student.has_voted
      }
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Student with this SCS number already exists' });
    }
    console.error(error);
    res.status(500).json({ error: 'Failed to create student' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, class: cls, house } = req.body;

    const studRes = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    const student = studRes.rows[0];

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (house && !['Spartans', 'Vikings', 'Knights', 'Samurais'].includes(house)) {
      return res.status(400).json({ error: 'Invalid house' });
    }

    const result = await pool.query(
      `UPDATE students
       SET name = $1, class = $2, house = $3, updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [name || student.name, cls || student.class, house || student.house, id]
    );

    const updated = result.rows[0];
    await log('student_updated', 'student', id, { name, class: cls, house });

    res.json({
      success: true,
      student: {
        id: updated.id,
        scs_no: updated.scs_no,
        name: updated.name,
        class: updated.class,
        house: updated.house,
        has_voted: updated.has_voted
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update student' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const studRes = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    const student = studRes.rows[0];

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await pool.query('DELETE FROM students WHERE id = $1', [id]);
    await log('student_deleted', 'student', id, { scs_no: student.scs_no });

    res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

exports.bulkImport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

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

    const client = await pool.connect();
    try {
      let imported = 0;
      let skipped = 0;

      for (const row of rows) {
        const scs_no = String(row.scs_no || row.SCS_NO || row.SCS || '').trim();
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
          await client.query(
            'INSERT INTO students (scs_no, name, class, house) VALUES ($1, $2, $3, $4)',
            [scs_no, name, cls, house]
          );
          imported++;
        } catch (error) {
          skipped++;
        }
      }

      await log('students_imported', 'bulk_import', null, { imported, skipped });

      res.json({
        success: true,
        message: `Imported ${imported} students, skipped ${skipped}`,
        imported,
        skipped
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import students' });
  }
};
