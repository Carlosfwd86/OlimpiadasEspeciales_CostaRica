const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const auth = require('../middlewares/authMiddleware');

// GET /api/stats — solo usuarios autenticados
router.get('/', auth, getStats);

module.exports = router;
