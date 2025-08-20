// CRUD de usuarios bajo /users (lista, update, delete).
// Mantiene compatibilidad con el frontend actual.
const express = require('express');
const router = express.Router();
const db = require('../db');

// List users (GET /users)
router.get('/', (req, res) => {
  db.all(`SELECT id, username FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update user (PUT /users/:id)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  db.run(`UPDATE users SET username = ?, password = ? WHERE id = ?`,
    [username, password, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
      res.json({ id, username });
    }
  );
});

// Delete user (DELETE /users/:id)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true });
  });
});

module.exports = router;
