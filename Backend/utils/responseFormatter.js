/**
 * Formatea una respuesta de éxito
 * @param {string} message - Mensaje descriptivo
 * @param {any} data - Datos a devolver
 * @returns {object} Respuesta estructurada
 */
const successResponse = (message, data = null) => {
  return {
    success: true,
    message,
    data
  };
};

/**
 * Formatea una respuesta de error
 * @param {string} message - Mensaje descriptivo
 * @param {any} errors - Detalles del error (opcional)
 * @returns {object} Respuesta estructurada
 */
const errorResponse = (message, errors = null) => {
  return {
    success: false,
    message,
    errors
  };
};

module.exports = {
  successResponse,
  errorResponse
};
