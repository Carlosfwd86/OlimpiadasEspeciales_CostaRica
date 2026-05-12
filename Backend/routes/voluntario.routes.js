const express = require('express');
const router = express.Router();
const voluntarioController = require('../controllers/voluntario.controller.js');

const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// Rutas para la gestión de Voluntarios
router.use(auth);

router.get('/', voluntarioController.obtenerTodos);
router.get('/:id', voluntarioController.obtenerPorId);

// Solo Admin
router.post('/', checkRole([1]), voluntarioController.crear);
router.put('/:id', checkRole([1]), voluntarioController.actualizar);
router.delete('/:id', checkRole([1]), voluntarioController.eliminar);

module.exports = router;
