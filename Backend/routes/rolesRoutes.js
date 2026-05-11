const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

// Ruta para obtener todos los roles
router.get('/', rolesController.obtenerRoles);

// Ruta para crear un nuevo rol
router.post('/', rolesController.crearRol);

// Ruta para actualizar un rol
router.put('/:id', rolesController.actualizarRol);

// Ruta para eliminar un rol
router.delete('/:id', rolesController.eliminarRol);

module.exports = router;
