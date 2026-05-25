const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const validators = require('../utils/validators');
const auth = require('../middlewares/authMiddleware');

// Ruta para el registro de nuevos usuarios con validación estricta
router.post('/register', validators.registro, validate, authController.registrarUsuario);

// Ruta para el inicio de sesión con validación
router.post('/login', validators.login, validate, authController.iniciarSesion);

// Ruta para cerrar sesión (el servidor invalida el token en BD y limpia la cookie)
router.post('/logout', authController.cerrarSesion);

// Rutas de recuperación de contraseña
router.post('/forgot-password', validators.forgotPassword, validate, authController.solicitarRecuperacion);
router.post('/reset-password', validators.resetPassword, validate, authController.restablecerContrasena);

/**
 * GET /api/auth/me
 * Verifica la sesión activa sin lanzar 401 en consola.
 * Responde siempre 200: { usuario: <payload> } o { usuario: null }
 */
router.get('/me', authController.getMe);

// Perfil del usuario autenticado
router.get('/profile',  auth, authController.getProfile);
router.patch('/profile', auth, authController.updateProfile);

module.exports = router;
