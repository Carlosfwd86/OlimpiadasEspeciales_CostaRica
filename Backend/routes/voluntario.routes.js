const express = require('express');
const router = express.Router();
const voluntarioController = require('../controllers/voluntario.controller.js');

const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// Rutas para la gestión de Voluntarios
router.use(auth);

router.get('/', voluntarioController.obtenerTodos);
router.get('/:id', voluntarioController.obtenerPorId);
// ⚠️ Las rutas específicas DEBEN ir ANTES de PUT /:id (orden crítico en Express)
router.put('/:id/aprobar', voluntarioController.aprobar);
router.put('/:id/rechazar', voluntarioController.rechazar);
router.put('/:id', voluntarioController.actualizar);
router.post('/', voluntarioController.crear);
router.delete('/:id', voluntarioController.eliminar);

module.exports = router;
