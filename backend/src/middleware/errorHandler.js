const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({ error: 'Invalid data: constraint violation' });
  }

  if (err.message.includes('UNIQUE constraint failed')) {
    return res.status(400).json({ error: 'Duplicate entry' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;
