const express = require('express');
const router = express.Router();

// Importar rutas específicas
const authRoutes = require('./authRoutes');
const rolesRoutes = require('./rolesRoutes');
const permisosRoutes = require('./permisosRoutes');

// Definir rutas base
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API funcionando correctamente' });
});

// Registrar rutas
router.use('/auth', authRoutes);
router.use('/roles', rolesRoutes);
router.use('/permisos', permisosRoutes);

module.exports = router;
