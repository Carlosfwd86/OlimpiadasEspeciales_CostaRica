require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston');

const { sequelize } = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');

// Logger profesional
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

// Registro manual de rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/usuarios', require('./routes/usuario.routes'));
app.use('/api/Admin', require('./routes/admin.routes'));
app.use('/api/atletas', require('./routes/atletaRoutes'));
app.use('/api/competiciones', require('./routes/competicion.routes'));
app.use('/api/competicion-atleta', require('./routes/competicion_atleta.routes'));
app.use('/api/consultas', require('./routes/consultas.routes'));
app.use('/api/disciplinas', require('./routes/disciplinas.routes'));
app.use('/api/entrenadores', require('./routes/entrenador.routes'));
app.use('/api/inscripciones', require('./routes/inscripciones.routes'));
app.use('/api/niveles-habilidad', require('./routes/nivelesHabilidad.routes'));
app.use('/api/programas', require('./routes/programas.routes'));
app.use('/api/roles', require('./routes/rolesRoutes'));
app.use('/api/tutores', require('./routes/tutores.routes'));
app.use('/api/voluntarios', require('./routes/voluntario.routes'));
app.use('/api/voluntario-area', require('./routes/voluntario_area.routes'));

// Nuevos endpoints
app.use('/api/stats', require('./routes/stats.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/registros-pendientes', require('./routes/registrosPendientes.routes'));
app.use('/api/actividad-sistema', require('./routes/actividadSistema.routes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/certificados', require('./routes/certificadoRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Inicialización del servidor y base de datos
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexión a la base de datos establecida exitosamente.');
    
    await sequelize.sync({ alter: false }); 
    logger.info('✅ Modelos sincronizados.');

    app.listen(PORT, () => {
      logger.info(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
