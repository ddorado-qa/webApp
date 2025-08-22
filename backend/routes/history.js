// Registro de acciones de usuario
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /history
router.get('/', (req, res) => {
  db.all(`SELECT * FROM history ORDER BY timestamp DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /history (registrar acción)
router.post('/', (req, res) => {
  const { userId, action } = req.body;
  db.run(
    `INSERT INTO history (userId, action) VALUES (?, ?)`,
    [userId, action],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, userId, action });
    }
  );
});

module.exports = router;
