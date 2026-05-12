const express = require('express');
const router = express.Router();
const voluntarioController = require('../controllers/voluntario.controller.js');

// Rutas para la gestión de Voluntarios

router.get('/', voluntarioController.obtenerTodos);
router.get('/:id', voluntarioController.obtenerPorId);
router.post('/', voluntarioController.crear);
router.put('/:id', voluntarioController.actualizar);
router.put('/:id/aprobar', voluntarioController.aprobar);
router.put('/:id/rechazar', voluntarioController.rechazar);
router.delete('/:id', voluntarioController.eliminar);

module.exports = router;
