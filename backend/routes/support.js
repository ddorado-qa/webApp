// Stub de micro-backend Support
const express = require('express');
const router = express.Router();

// Ejemplo: GET /support/health
router.get('/health', (req, res) => res.json({ status: 'ok', service: 'support' }));

module.exports = router;
