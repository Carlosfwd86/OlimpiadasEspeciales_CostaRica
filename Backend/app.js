require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { sequelize } = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(helmet()); // Seguridad en cabeceras HTTP
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logger de peticiones

// Rutas
app.use('/api', routes);

// Middleware para manejar errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Inicialización del servidor y base de datos
const startServer = async () => {
  try {
    // Autenticar la conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida exitosamente.');
    
    // Opcional: sincronizar modelos (crear tablas si no existen)
    // await sequelize.sync({ alter: true }); 
    // console.log('✅ Modelos sincronizados.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
