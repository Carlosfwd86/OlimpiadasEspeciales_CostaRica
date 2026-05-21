const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const validators = require('../utils/validators');
const auth = require('../middlewares/authMiddleware');

// ── JWT_SECRET ya es validado al cargar authController/authMiddleware ──────────
const JWT_SECRET = process.env.JWT_SECRET;

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
router.get('/me', (req, res) => {
  try {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(200).json({ usuario: null });

    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ usuario: decoded });
  } catch {
    res.status(200).json({ usuario: null });
  }
});

// Perfil del usuario autenticado
router.get('/profile',  auth, authController.getProfile);
router.patch('/profile', auth, authController.updateProfile);

module.exports = router;
