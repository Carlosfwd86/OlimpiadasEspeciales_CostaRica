const express = require('express');
const router = express.Router();
const voluntarioAreaController = require('../controllers/voluntario_area.controller.js');
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

router.use(auth);

// Rutas para la tabla auxiliar voluntario_areas
router.get('/', voluntarioAreaController.obtenerTodas);

// Solo Admin
router.post('/', checkRole([1]), voluntarioAreaController.crear);
router.delete('/:id', checkRole([1]), voluntarioAreaController.eliminar);

module.exports = router;
