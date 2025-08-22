// CRUD básico de perfil de usuario
const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener perfil (GET /profile/:id)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT id, username, email, role, subscribed FROM users WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json(row);
  });
});

// Actualizar perfil (PUT /profile/:id)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, role, subscribed } = req.body || {};
  db.run(
    `UPDATE users SET username=?, email=?, role=?, subscribed=? WHERE id=?`,
    [username, email, role, subscribed ? 1 : 0, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
      res.json({ id, username, email, role, subscribed });
    }
  );
});

module.exports = router;
