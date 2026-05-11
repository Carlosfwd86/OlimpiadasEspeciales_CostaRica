const express = require('express');
const router = express.Router();

// [verde] Importación de rutas específicas del módulo de Atletas
const atletaRoutes = require('./atletaRoutes');

// [verde] Importación de rutas del módulo de Autenticación y Roles
const authRoutes = require('./authRoutes');
const rolesRoutes = require('./rolesRoutes');
const permisosRoutes = require('./permisosRoutes');

// Definir rutas base
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API funcionando correctamente' });
});

// [verde] Registro de rutas para el módulo de Atletas
router.use('/atletas', atletaRoutes);

// [verde] Registro de rutas para el módulo de Autenticación
router.use('/auth', authRoutes);
router.use('/roles', rolesRoutes);
router.use('/permisos', permisosRoutes);

module.exports = router;
