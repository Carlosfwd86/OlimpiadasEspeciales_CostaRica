const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para registrar un nuevo usuario (atleta o cualquier rol)
router.post('/registro', authController.registrarUsuario);

// Ruta para iniciar sesión
router.post('/login', authController.iniciarSesion);

// Ruta para cerrar sesión (requeriría un token en el header)
router.post('/logout', authController.cerrarSesion);

module.exports = router;
