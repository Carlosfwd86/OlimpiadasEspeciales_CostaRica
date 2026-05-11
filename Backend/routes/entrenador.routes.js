const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenador.controller.js');

// Rutas para la gestión de Entrenadores

// Obtener todos los entrenadores
router.get('/', entrenadorController.obtenerTodos);

// Obtener un entrenador por ID
router.get('/:id', entrenadorController.obtenerPorId);

// Registrar un nuevo entrenador
router.post('/', entrenadorController.crear);

// Actualizar un entrenador por ID
router.put('/:id', entrenadorController.actualizar);

// Eliminar un entrenador por ID
router.delete('/:id', entrenadorController.eliminar);

module.exports = router;
