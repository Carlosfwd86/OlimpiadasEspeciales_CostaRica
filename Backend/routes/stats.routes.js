const express = require('express');
const router = express.Router();
const { getStats, getCharts } = require('../controllers/statsController');
const auth = require('../middlewares/authMiddleware');

// GET /api/stats — Estadísticas para StatCards (Usado por ServicesAdmin.ts)
router.get('/', auth, getStats);

// GET /api/stats/summary — Compatibilidad
router.get('/summary', auth, getStats);

// GET /api/stats/charts — Datos para gráficos
router.get('/charts', auth, getCharts);


// Compatibilidad con Landing Page
router.get('/public', getStats);


module.exports = router;
