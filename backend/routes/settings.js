// Stub de micro-backend Settings
const express = require('express');
const router = express.Router();

// Ejemplo: GET /settings/health
router.get('/health', (req, res) => res.json({ status: 'ok', service: 'settings' }));

module.exports = router;
