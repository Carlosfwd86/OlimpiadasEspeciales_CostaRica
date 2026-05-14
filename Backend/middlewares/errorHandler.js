const { errorResponse } = require('../utils/responseFormatter');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Errores de Sequelize con códigos específicos
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json(errorResponse('Error de validación de datos', err.errors.map(e => e.message)));
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const campo = err.errors?.[0]?.path || 'campo';
    return res.status(409).json(errorResponse(`Ya existe un registro con ese ${campo}.`));
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json(errorResponse('No se puede eliminar: existen registros relacionados.'));
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json(errorResponse('Error de base de datos.'));
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  res.status(statusCode).json(errorResponse(message, err.details || null));
};

module.exports = errorHandler;
