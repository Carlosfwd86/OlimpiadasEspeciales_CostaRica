const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// GET /api/settings — cualquier usuario autenticado puede leer
router.get('/', auth, getSettings);

// PUT /api/settings — solo Administrador puede modificar
router.put('/', auth, checkRole([1]), updateSettings);

module.exports = router;
