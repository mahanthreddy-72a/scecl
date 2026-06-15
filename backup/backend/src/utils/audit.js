const pool = require('../db');

const log = async (action, entityType, entityId, details) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs (action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, $4)`,
      [action, entityType, entityId, details]
    );
  } catch (error) {
    console.error('Audit log error:', error);
  }
};

const getAuditLogs = async (limit = 100) => {
  const result = await pool.query(
    `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
};

module.exports = {
  log,
  getAuditLogs
};
