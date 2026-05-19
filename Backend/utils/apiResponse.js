/**
 * Formatea una respuesta de éxito.
 * @param {any} data - Los datos a retornar (puede ser objeto, array, etc).
 * @param {string} message - Mensaje descriptivo.
 * @param {object} meta - Metadatos opcionales (ej. paginación).
 * @returns {object} Respuesta estructurada.
 */
const successResponse = (data, message = 'Operación exitosa', meta = null) => {
  const response = {
    status: 200,
    message,
    data
  };
  
  if (meta) {
    response.meta = meta;
  }
  
  return response;
};

/**
 * Formatea una respuesta de error.
 * @param {string} message - Mensaje de error descriptivo.
 * @param {number} status - Código de estado HTTP.
 * @param {any} errors - Detalles del error opcionales.
 * @returns {object} Respuesta estructurada de error.
 */
const errorResponse = (message = 'Error interno del servidor', status = 500, errors = null) => {
  const response = {
    status,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return response;
};

/**
 * Helper para extraer paginación de la request.
 * Si no se especifica limit, por defecto retorna un valor muy alto para mantener compatibilidad con el frontend actual.
 * @param {object} reqQuery - req.query
 * @returns {object} { limit, offset, page }
 */
const getPagination = (reqQuery) => {
  const page = parseInt(reqQuery.page, 10) || 1;
  const limit = parseInt(reqQuery.limit, 10) || 1000; // Por defecto 1000 para no romper tablas de frontend
  const offset = (page - 1) * limit;

  return { limit, offset, page };
};

/**
 * Helper para generar el meta objeto de paginación
 * @param {number} totalItems - Cantidad total de registros.
 * @param {number} limit - Límite de registros por página.
 * @param {number} page - Página actual.
 * @returns {object}
 */
const getPagingData = (totalItems, limit, page) => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    totalPages,
    currentPage: page,
    limit
  };
};

module.exports = {
  successResponse,
  errorResponse,
  getPagination,
  getPagingData
};
