const express = require('express');
const router = express.Router();
const { getSummary, getCharts } = require('../controllers/statsController');
const auth = require('../middlewares/authMiddleware');

// GET /api/stats/summary — Estadísticas para StatCards
router.get('/summary', auth, getSummary);

// GET /api/stats/charts — Datos para gráficos
router.get('/charts', auth, getCharts);

// Compatibilidad con Landing Page (opcional, podrías hacer un getPublicStats)
router.get('/public', getSummary);

module.exports = router;
