const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// Rutas de Usuarios
router.get('/', usuarioController.getByFilter);              // Búsqueda por email (usada en aprobación)
router.get('/all', auth, checkRole([1]), usuarioController.getAll);   // Solo admins
router.get('/:id', auth, usuarioController.getById);         // Usuario autenticado puede ver su propio perfil
router.patch('/:id', auth, usuarioController.update);        // Usuario autenticado puede editar su perfil
router.delete('/:id', auth, checkRole([1]), usuarioController.delete); // Solo admins pueden eliminar

module.exports = router;
