const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Errores de Sequelize con códigos específicos
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json(errorResponse('Error de validación de datos', 400, err.errors.map(e => e.message)));
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const campo = err.errors?.[0]?.path || 'campo';
    return res.status(409).json(errorResponse(`Ya existe un registro con ese ${campo}.`, 409));
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json(errorResponse('No se puede eliminar: existen registros relacionados.', 409));
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json(errorResponse('Error de base de datos.', 500));
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  res.status(statusCode).json(errorResponse(message, statusCode, err.details || null));
};

module.exports = errorHandler;
