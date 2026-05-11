const express = require('express');
const router = express.Router();

// Importar rutas de las 5 tablas solicitadas
const entrenadorRoutes = require('./entrenador.routes');
const voluntarioRoutes = require('./voluntario.routes');
const voluntarioAreaRoutes = require('./voluntario_area.routes');
const competicionRoutes = require('./competicion.routes');
const competicionAtletaRoutes = require('./competicion_atleta.routes');

// Definir ruta de salud
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API funcionando correctamente' });
});

// Registrar las rutas de los 5 módulos bajo sus respectivos prefijos
router.use('/entrenadores', entrenadorRoutes);
router.use('/voluntarios', voluntarioRoutes);
router.use('/voluntario-areas', voluntarioAreaRoutes);
router.use('/competiciones', competicionRoutes);
router.use('/competicion-atletas', competicionAtletaRoutes);

module.exports = router;
