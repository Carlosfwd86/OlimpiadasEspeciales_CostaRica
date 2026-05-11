const express = require('express');
const router = express.Router();

// Importar rutas específicas
// const userRoutes = require('./user.routes');

// Definir rutas base
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API funcionando correctamente' });
});

// router.use('/users', userRoutes);

module.exports = router;
