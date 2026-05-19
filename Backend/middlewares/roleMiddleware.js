const { errorResponse } = require('../utils/apiResponse');

/**
 * Middleware para verificar si el usuario tiene uno de los roles permitidos.
 * @param {Array<number|string>} allowedRoles - Lista de IDs de roles o nombres permitidos.
 */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(errorResponse('Usuario no autenticado.', 401));
    }

    const { rol_id } = req.user;

    // Verificar si el rol del usuario está en la lista de permitidos
    // Nota: El rol_id suele ser numérico según el modelo Rol.js
    if (!allowedRoles.includes(rol_id)) {
      return res.status(403).json(errorResponse('No tienes permiso para realizar esta acción.', 403, 'Nivel de acceso insuficiente.'));
    }

    next();
  };
};

module.exports = checkRole;
