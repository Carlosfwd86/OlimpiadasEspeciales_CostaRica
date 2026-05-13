const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// Rutas administrativas (protegidas)
router.get('/registros_pendientes', adminController.getRegistrosPendientes);
router.get('/stats', adminController.getStats);
router.get('/graficos', adminController.getGraficos);

module.exports = router;
