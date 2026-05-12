const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  try {
    // Busca el token en cookies primero, luego en el header Authorization
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
    // Adjuntar la información del usuario a la petición
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'El token ha expirado. Por favor, inicie sesión de nuevo.' });
    }
    return res.status(401).json({ error: 'Token inválido o malformado.' });
  }
};

module.exports = authMiddleware;
