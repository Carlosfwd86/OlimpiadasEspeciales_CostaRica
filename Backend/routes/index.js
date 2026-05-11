const express = require('express');
const router = express.Router();

// Importar rutas específicas
const tutoresRoutes = require('./tutores.routes');
const disciplinasRoutes = require('./disciplinas.routes');
const programasRoutes = require('./programas.routes');
const nivelesHabilidadRoutes = require('./nivelesHabilidad.routes');
const inscripcionesRoutes = require('./inscripciones.routes');
const consultasRoutes = require('./consultas.routes');

// Definir rutas base
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API funcionando correctamente' });
});

router.use('/tutores', tutoresRoutes);
router.use('/disciplinas', disciplinasRoutes);
router.use('/programas', programasRoutes);
router.use('/niveles_habilidad', nivelesHabilidadRoutes);
router.use('/inscripciones', inscripcionesRoutes);
router.use('/consultas', consultasRoutes);

module.exports = router;
