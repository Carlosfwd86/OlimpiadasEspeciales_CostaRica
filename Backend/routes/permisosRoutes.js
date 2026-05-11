const express = require('express');
const router = express.Router();
const permisosController = require('../controllers/permisosController');

// Ruta para obtener todos los permisos
router.get('/', permisosController.obtenerPermisos);

// Ruta para crear un nuevo permiso
router.post('/', permisosController.crearPermiso);

// Ruta para eliminar un permiso
router.delete('/:id', permisosController.eliminarPermiso);

module.exports = router;
