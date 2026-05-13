const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const validators = require('../utils/validators');

// Ruta para el registro de nuevos usuarios con validación estricta
router.post('/register', validators.registro, validate, authController.registrarUsuario);

// Ruta para el inicio de sesión con validación
router.post('/login', validators.login, validate, authController.iniciarSesion);

// Ruta para cerrar sesión (protegida por el cliente, pero el servidor invalida el token)
router.post('/logout', authController.cerrarSesion);

// Nuevo endpoint para verificar sesión (sin devolver 401 para evitar errores en consola)
const jwt = require('jsonwebtoken');
router.get('/me', (req, res) => {
  try {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(200).json({ usuario: null });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    res.status(200).json({ usuario: decoded });
  } catch (error) {
    res.status(200).json({ usuario: null });
  }
});

// Perfil del usuario autenticado
const auth = require('../middlewares/authMiddleware');
router.get('/profile',  auth, authController.getProfile);
router.patch('/profile', auth, authController.updateProfile);

module.exports = router;
