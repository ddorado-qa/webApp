// Stub de micro-backend Profile para extender flujos sin romper nada.
const express = require('express');
const router = express.Router();

// Ejemplo: GET /profile/health
router.get('/health', (req, res) => res.json({ status: 'ok', service: 'profile' }));

module.exports = router;
