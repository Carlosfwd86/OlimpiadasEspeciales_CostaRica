const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Middleware que captura los resultados de express-validator y responde
 * con un 400 formateado si hay errores de validación.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (errors.isEmpty()) {
    return next();
  }

  // Formatear errores para que sean legibles por el frontend
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(400).json(errorResponse('Error de validación de datos', 400, extractedErrors));
};

module.exports = validate;
