const express = require('express');
const router = express.Router();
const voluntarioAreaController = require('../controllers/voluntario_area.controller.js');

// Rutas para la tabla auxiliar voluntario_areas
router.get('/', voluntarioAreaController.obtenerTodas);
router.post('/', voluntarioAreaController.crear);
router.delete('/:id', voluntarioAreaController.eliminar);

module.exports = router;
