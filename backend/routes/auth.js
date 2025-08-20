// Rutas de autenticación que mantienen EXACTAMENTE las mismas URLs
// que ya usa tu frontend: POST /register y POST /login
const express = require('express');
const router = express.Router();
const db = require('../db');

// Registro (POST /register)
router.post('/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  db.run(`INSERT INTO users(username,password) VALUES (?,?)`, [username, password], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID, username });
  });
});

// Login (POST /login)
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  db.get(`SELECT id, username FROM users WHERE username=? AND password=?`, [username, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    res.json(row);
  });
});

module.exports = router;
