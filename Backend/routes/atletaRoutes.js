const express = require('express');
const router = express.Router();
const atletaController = require('../controllers/atletaController');

// [verde] Definición de rutas para el módulo de Atletas
// [verde] Las rutas permiten gestionar el ciclo de vida completo de la información del atleta

const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validationMiddleware');
const validators = require('../utils/validators');

// [verde] Todas las rutas de atletas requieren autenticación
router.use(auth);

// [verde] Listado y detalle (Cualquier usuario autenticado)
router.get('/', atletaController.obtenerTodosLosAtletas);
router.get('/:id', atletaController.obtenerAtletaPorId);

// [verde] Operaciones de escritura (Solo Administradores - ID: 1)
router.post('/', checkRole([1]), validators.atleta, validate, atletaController.crearAtleta);
router.put('/:id', checkRole([1]), validators.atleta, validate, atletaController.actualizarAtleta);
router.delete('/:id', checkRole([1]), atletaController.eliminarAtleta);

module.exports = router;
