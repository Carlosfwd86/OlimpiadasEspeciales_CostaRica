const express = require('express');
const router = express.Router();
const competicionController = require('../controllers/competicion.controller.js');

// Rutas para la gestión de Competiciones

router.get('/', competicionController.obtenerTodas);
router.get('/:id', competicionController.obtenerPorId);
router.post('/', competicionController.crear);
router.put('/:id', competicionController.actualizar);
router.delete('/:id', competicionController.eliminar);

// Ruta especial para la inscripción de atletas en torneos
router.post('/inscribir-atleta', competicionController.inscribirAtleta);

module.exports = router;
