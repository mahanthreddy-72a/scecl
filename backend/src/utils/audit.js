const db = require('../db');

const log = (action, entityType, entityId, details) => {
  db.prepare(`
    INSERT INTO audit_logs (action, entity_type, entity_id, details)
    VALUES (?, ?, ?, ?)
  `).run(action, entityType, entityId, JSON.stringify(details));
};

const getAuditLogs = (limit = 100) => {
  return db.prepare(`
    SELECT * FROM audit_logs
    ORDER BY created_at DESC
    LIMIT ?
  `).all(limit);
};

module.exports = {
  log,
  getAuditLogs
};
