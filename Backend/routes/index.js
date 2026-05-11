const express = require('express');
const router = express.Router();

// [verde] Importación de rutas específicas del módulo
const atletaRoutes = require('./atletaRoutes');

// Definir rutas base
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API funcionando correctamente' });
});

// [verde] Registro de rutas para el módulo de Atletas
router.use('/atletas', atletaRoutes);

module.exports = router;

