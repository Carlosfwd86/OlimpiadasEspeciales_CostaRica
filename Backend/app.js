require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston');

const { sequelize } = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');

// Logger profesional - validation reload
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

const app = express();

// CORS — whitelist de orígenes permitidos
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, curl, mobile apps)
    if (!origin || allowedOrigins.includes(origin) || origin.includes('localhost')) return callback(null, true);
    callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'storage/public')));

// Registro manual de rutas
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/usuarios', require('./routes/usuario.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));
app.use('/api/v1/atletas', require('./routes/atletaRoutes'));
app.use('/api/v1/competiciones', require('./routes/competicion.routes'));
app.use('/api/v1/competiciones-atletas', require('./routes/competicion_atleta.routes'));
app.use('/api/v1/consultas', require('./routes/consultas.routes'));
app.use('/api/v1/disciplinas', require('./routes/disciplinas.routes'));
app.use('/api/v1/entrenadores', require('./routes/entrenador.routes'));
app.use('/api/v1/inscripciones', require('./routes/inscripciones.routes'));
app.use('/api/v1/niveles-habilidad', require('./routes/nivelesHabilidad.routes'));
app.use('/api/v1/programas', require('./routes/programas.routes'));
app.use('/api/v1/roles', require('./routes/rolesRoutes'));
app.use('/api/v1/tutores', require('./routes/tutores.routes'));
app.use('/api/v1/voluntarios', require('./routes/voluntario.routes'));
app.use('/api/v1/voluntarios-areas', require('./routes/voluntario_area.routes'));

// Nuevos endpoints
app.use('/api/v1/stats', require('./routes/stats.routes'));
app.use('/api/v1/settings', require('./routes/settings.routes'));
app.use('/api/v1/registros-pendientes', require('./routes/registrosPendientes.routes'));
app.use('/api/v1/actividades-sistema', require('./routes/actividadSistema.routes'));
app.use('/api/v1/chats', require('./routes/chat.routes'));
app.use('/api/v1/ia', require('./routes/ia.routes'));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Inicialización del servidor y base de datos
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexión a la base de datos establecida exitosamente.');
    
    await sequelize.sync({ alter: false }); 
    logger.info('✅ Modelos sincronizados.');

    const consultaIaService = require('./services/consultaIaService');
    if (consultaIaService.autoResponderHabilitado()) {
      setImmediate(async () => {
        try {
          const resumen = await consultaIaService.procesarColaPendientes();
          if (resumen.total > 0) {
            logger.info(`🤖 [Auto IA] ${resumen.message}`);
          }
        } catch (err) {
          logger.error(`🤖 [Auto IA] Error al procesar cola: ${err.message}`);
        }
      });
    }

    app.listen(PORT, () => {
      logger.info(`🚀 Servidor corriendo en el puerto ${PORT}`);
      if (consultaIaService.autoResponderHabilitado()) {
        logger.info('🤖 Respuesta automática de consultas: ACTIVA (formulario + cola pendiente)');
      }
    });
  } catch (error) {
    logger.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
