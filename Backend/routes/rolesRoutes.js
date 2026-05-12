const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

router.use(auth);

// Obtener todos los roles
router.get('/', rolesController.obtenerRoles);

// Solo Admin puede crear, actualizar o eliminar roles
router.post('/', checkRole([1]), rolesController.crearRol);
router.put('/:id', checkRole([1]), rolesController.actualizarRol);
router.delete('/:id', checkRole([1]), rolesController.eliminarRol);

module.exports = router;
