const { errorResponse } = require('../utils/responseFormatter');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // Si es un error de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json(errorResponse('Error de validación de datos', err.errors));
  }

  res.status(statusCode).json(errorResponse(message, err.details || null));
};

module.exports = errorHandler;
