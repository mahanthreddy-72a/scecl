const pool = require('../db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalRes, votesRes, participationRes] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM students'),
      pool.query('SELECT COUNT(DISTINCT student_id) as count FROM votes'),
      pool.query('SELECT COUNT(*) as count FROM students WHERE has_voted = TRUE')
    ]);

    const totalStudents = parseInt(totalRes.rows[0].count);
    const votesCast = parseInt(votesRes.rows[0].count);
    const studentsVoted = parseInt(participationRes.rows[0].count);
    const remainingStudents = totalStudents - studentsVoted;
    const participationPercentage = totalStudents > 0 ? Math.round((studentsVoted / totalStudents) * 100) : 0;

    res.json({
      stats: {
        totalStudents,
        votesCast,
        studentsVoted,
        remainingStudents,
        participationPercentage
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load statistics' });
  }
};

exports.getActivityLogs = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const result = await pool.query(`
      SELECT
        al.id,
        al.student_id,
        al.status,
        al.created_at,
        s.name,
        s.scs_no
      FROM activity_logs al
      LEFT JOIN students s ON al.student_id = s.id
      ORDER BY al.created_at DESC
      LIMIT $1
    `, [limit]);

    res.json({ activityLogs: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load activity logs' });
  }
};

exports.getElectionResults = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.name,
        c.position,
        c.house,
        c.vote_count,
        COUNT(DISTINCT v.student_id) as votes
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      GROUP BY c.id, c.name, c.position, c.house, c.vote_count
      ORDER BY c.position ASC, votes DESC, c.name ASC
    `);

    const resultsByPosition = {};
    result.rows.forEach(row => {
      if (!resultsByPosition[row.position]) {
        resultsByPosition[row.position] = [];
      }
      resultsByPosition[row.position].push(row);
    });

    res.json({ results: resultsByPosition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load results' });
  }
};

exports.getPositionResults = async (req, res) => {
  try {
    const { position } = req.params;

    const result = await pool.query(`
      SELECT
        c.id,
        c.name,
        c.position,
        c.house,
        COUNT(DISTINCT v.student_id) as votes
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE c.position = $1
      GROUP BY c.id, c.name, c.position, c.house
      ORDER BY votes DESC, c.name ASC
    `, [position]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Position not found' });
    }

    res.json({ position, results: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load position results' });
  }
};

exports.getHouseResults = async (req, res) => {
  try {
    const houses = ['Spartans', 'Vikings', 'Knights', 'Samurais'];
    const houseResults = {};

    for (const house of houses) {
      const result = await pool.query(`
        SELECT
          c.id,
          c.name,
          c.position,
          c.house,
          COUNT(DISTINCT v.student_id) as votes
        FROM candidates c
        LEFT JOIN votes v ON c.id = v.candidate_id
        WHERE c.house = $1
        GROUP BY c.id, c.name, c.position, c.house
        ORDER BY c.position ASC, votes DESC, c.name ASC
      `, [house]);

      houseResults[house] = result.rows;
    }

    res.json({ houseResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load house results' });
  }
};

exports.getParticipationByClass = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        class,
        COUNT(*) as total,
        SUM(CASE WHEN has_voted THEN 1 ELSE 0 END) as voted,
        ROUND(CAST(SUM(CASE WHEN has_voted THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(*) * 100, 2) as percentage
      FROM students
      GROUP BY class
      ORDER BY class ASC
    `);

    res.json({ results: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load class participation' });
  }
};

exports.getParticipationByHouse = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        house,
        COUNT(*) as total,
        SUM(CASE WHEN has_voted THEN 1 ELSE 0 END) as voted,
        ROUND(CAST(SUM(CASE WHEN has_voted THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(*) * 100, 2) as percentage
      FROM students
      GROUP BY house
      ORDER BY house ASC
    `);

    res.json({ results: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load house participation' });
  }
};

exports.getCurrentActivity = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        status,
        COUNT(*) as count
      FROM activity_logs
      WHERE created_at > NOW() - INTERVAL '1 hour'
      GROUP BY status
    `);

    const activityMap = {
      logged_in: 0,
      viewing_ballot: 0,
      voting: 0,
      submitted: 0
    };

    result.rows.forEach(item => {
      activityMap[item.status] = item.count;
    });

    res.json({ activity: activityMap });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load current activity' });
  }
};
