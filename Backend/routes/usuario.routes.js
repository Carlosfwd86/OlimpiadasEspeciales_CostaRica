const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rutas de Usuarios
router.get('/', usuarioController.getByFilter); // Para búsqueda por email
router.get('/all', usuarioController.getAll);   // Para el listado del sistema
router.get('/:id', usuarioController.getById);
router.patch('/:id', usuarioController.update);
router.delete('/:id', usuarioController.delete);

module.exports = router;
