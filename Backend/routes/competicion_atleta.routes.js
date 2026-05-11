const express = require('express');
const router = express.Router();
const competicionAtletaController = require('../controllers/competicion_atleta.controller.js');

// Rutas para la tabla pivote competicion_atletas
router.get('/', competicionAtletaController.obtenerTodas);
router.post('/', competicionAtletaController.crear);
router.put('/:id', competicionAtletaController.actualizar);
router.delete('/:id', competicionAtletaController.eliminar);

module.exports = router;
