// Configuración global simulada (para demo)
const express = require('express');
const router = express.Router();

// Memoria temporal (podrías persistirlo en DB si quieres)
let settings = {
  darkMode: false,
  language: 'en',
  notifications: true,
};

// GET /settings
router.get('/', (req, res) => {
  res.json(settings);
});

// PUT /settings
router.put('/', (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

module.exports = router;
