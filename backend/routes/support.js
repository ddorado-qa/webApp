// Soporte al usuario
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /support
router.get('/', (req, res) => {
  db.all(`SELECT * FROM support ORDER BY timestamp DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /support
router.post('/', (req, res) => {
  const { userId, subject, message } = req.body;
  if (!subject || !message) return res.status(400).json({ error: 'subject and message required' });

  db.run(
    `INSERT INTO support (userId, subject, message) VALUES (?, ?, ?)`,
    [userId, subject, message],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, userId, subject, message });
    }
  );
});

module.exports = router;
