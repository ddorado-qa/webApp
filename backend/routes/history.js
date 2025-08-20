// Stub de micro-backend History
const express = require('express');
const router = express.Router();

// Ejemplo: GET /history/health
router.get('/health', (req, res) => res.json({ status: 'ok', service: 'history' }));

module.exports = router;
