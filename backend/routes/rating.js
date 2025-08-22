// Valoraciones de la app
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /rating
router.get('/', (req, res) => {
  db.all(`SELECT * FROM ratings ORDER BY timestamp DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /rating
router.post('/', (req, res) => {
  const { userId, stars, comment } = req.body;
  if (!stars) return res.status(400).json({ error: 'stars required' });

  db.run(
    `INSERT INTO ratings (userId, stars, comment) VALUES (?, ?, ?)`,
    [userId, stars, comment],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, userId, stars, comment });
    }
  );
});

module.exports = router;
