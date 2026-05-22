const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenador.controller.js');
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const validators = require('../utils/validators');
const validate = require('../middlewares/validationMiddleware');

// Rutas para la gestión de Entrenadores

router.use(auth);

// Obtener todos los entrenadores
router.get('/', entrenadorController.obtenerTodos);

// Obtener un entrenador por ID
router.get('/:id', entrenadorController.obtenerPorId);

// Solo Admin puede mutar entrenadores
router.post('/', checkRole([1]), validators.entrenador, validate, entrenadorController.crear);

// Actualizar un entrenador por ID
router.put('/:id', checkRole([1]), validators.entrenador, validate, entrenadorController.actualizar);

// Eliminar un entrenador por ID
router.delete('/:id', checkRole([1]), entrenadorController.eliminar);

module.exports = router;
