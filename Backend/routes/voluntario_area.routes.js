const express = require('express');
const router = express.Router();
const voluntarioAreaController = require('../controllers/voluntario_area.controller.js');
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// Rutas para la tabla auxiliar voluntario_areas (GET público para formularios de registro)
router.get('/', voluntarioAreaController.obtenerTodas);

// Solo Admin
router.post('/', auth, checkRole([1]), voluntarioAreaController.crear);
router.delete('/:id', auth, checkRole([1]), voluntarioAreaController.eliminar);

module.exports = router;
