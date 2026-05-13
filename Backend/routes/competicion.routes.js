const express = require('express');
const router = express.Router();
const competicionController = require('../controllers/competicion.controller.js');

const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// Rutas públicas
router.get('/', competicionController.obtenerTodas);
router.get('/:id', competicionController.obtenerPorId);

// A partir de aquí, todas las rutas requieren autenticación
router.use(auth);

// Operaciones de escritura (Solo Admin)
router.post('/', checkRole([1]), competicionController.crear);
router.put('/:id', checkRole([1]), competicionController.actualizar);
router.delete('/:id', checkRole([1]), competicionController.eliminar);

// Ruta especial para la inscripción de atletas en torneos
router.post('/inscribir-atleta', checkRole([1]), competicionController.inscribirAtleta);

module.exports = router;
