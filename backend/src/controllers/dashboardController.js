const db = require('../db');

exports.getDashboardStats = (req, res) => {
  const totalStudents = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
  const votesCast = db.prepare('SELECT COUNT(DISTINCT student_id) as count FROM votes').get().count;
  const studentsVoted = db.prepare('SELECT COUNT(*) as count FROM students WHERE has_voted = 1').get().count;
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
};

exports.getActivityLogs = (req, res) => {
  const { limit = 50 } = req.query;

  const logs = db.prepare(`
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
    LIMIT ?
  `).all(limit);

  res.json({ activityLogs: logs });
};

exports.getElectionResults = (req, res) => {
  // Get all candidates with their vote counts grouped by position
  const results = db.prepare(`
    SELECT
      c.id,
      c.name,
      c.position,
      c.house,
      c.vote_count,
      COUNT(DISTINCT v.student_id) as votes
    FROM candidates c
    LEFT JOIN votes v ON c.id = v.candidate_id
    GROUP BY c.id
    ORDER BY c.position ASC, votes DESC, c.name ASC
  `).all();

  // Group by position
  const resultsByPosition = {};
  results.forEach(result => {
    if (!resultsByPosition[result.position]) {
      resultsByPosition[result.position] = [];
    }
    resultsByPosition[result.position].push(result);
  });

  res.json({ results: resultsByPosition });
};

exports.getPositionResults = (req, res) => {
  const { position } = req.params;

  const results = db.prepare(`
    SELECT
      c.id,
      c.name,
      c.position,
      c.house,
      COUNT(DISTINCT v.student_id) as votes
    FROM candidates c
    LEFT JOIN votes v ON c.id = v.candidate_id
    WHERE c.position = ?
    GROUP BY c.id
    ORDER BY votes DESC, c.name ASC
  `).all(position);

  if (results.length === 0) {
    return res.status(404).json({ error: 'Position not found' });
  }

  res.json({ position, results });
};

exports.getHouseResults = (req, res) => {
  const houses = ['Spartans', 'Vikings', 'Knights', 'Samurais'];
  const houseResults = {};

  houses.forEach(house => {
    const results = db.prepare(`
      SELECT
        c.id,
        c.name,
        c.position,
        c.house,
        COUNT(DISTINCT v.student_id) as votes
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE c.house = ?
      GROUP BY c.id
      ORDER BY c.position ASC, votes DESC, c.name ASC
    `).all(house);

    houseResults[house] = results;
  });

  res.json({ houseResults });
};

exports.getParticipationByClass = (req, res) => {
  const results = db.prepare(`
    SELECT
      class,
      COUNT(*) as total,
      SUM(has_voted) as voted,
      ROUND(CAST(SUM(has_voted) AS FLOAT) / COUNT(*) * 100, 2) as percentage
    FROM students
    GROUP BY class
    ORDER BY class ASC
  `).all();

  res.json({ results });
};

exports.getParticipationByHouse = (req, res) => {
  const results = db.prepare(`
    SELECT
      house,
      COUNT(*) as total,
      SUM(has_voted) as voted,
      ROUND(CAST(SUM(has_voted) AS FLOAT) / COUNT(*) * 100, 2) as percentage
    FROM students
    GROUP BY house
    ORDER BY house ASC
  `).all();

  res.json({ results });
};

exports.getCurrentActivity = (req, res) => {
  const activity = db.prepare(`
    SELECT
      status,
      COUNT(*) as count
    FROM activity_logs
    WHERE created_at > datetime('now', '-1 hour')
    GROUP BY status
  `).all();

  const activityMap = {
    logged_in: 0,
    viewing_ballot: 0,
    voting: 0,
    submitted: 0
  };

  activity.forEach(item => {
    activityMap[item.status] = item.count;
  });

  res.json({ activity: activityMap });
};
