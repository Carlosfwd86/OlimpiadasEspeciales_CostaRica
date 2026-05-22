const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { models } = require('../config/database');
const { Usuario, Sesion, TokenBlacklist } = models;
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sendResetPasswordEmail } = require('../helpers/emailHelper');

// ── Seguridad: JWT_SECRET es OBLIGATORIO ──────────────────────────────────────
// Si la variable no está definida el proceso se detiene inmediatamente.
// Esto evita que en producción se use un secreto débil por omisión.
if (!process.env.JWT_SECRET) {
  throw new Error(
    '[authController] JWT_SECRET no está definido en las variables de entorno. ' +
    'Agrega JWT_SECRET=<valor-seguro> en tu archivo .env antes de iniciar el servidor.'
  );
}
const JWT_SECRET = process.env.JWT_SECRET;
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @module authController
 * @description Controlador para autenticación y autorización (login, registro, sesiones, perfil de usuario).
 */

/**
 * @function registrarUsuario
 * @description Registra un nuevo usuario en la plataforma. Valida correos y cédulas duplicados y encripta la contraseña.
 */
const registrarUsuario = async (req, res) => {
  try {
    const { rol_id, nombre, apellido, cedula, correo_electronico, password, telefono, direccion, pais, fecha_nacimiento, genero, avatar_url } = req.body;

    // Validación de campos obligatorios
    if (!rol_id || !nombre || !correo_electronico || !password) {
      return res.status(400).json(errorResponse('Faltan campos obligatorios: rol_id, nombre, correo_electronico, password.', 400));
    }

    // Verifica si el correo ya está registrado
    const correoExistente = await Usuario.findOne({ where: { correo_electronico } });
    if (correoExistente) {
      return res.status(400).json(errorResponse('El correo electrónico ya está en uso.', 400));
    }

    // Verifica si la cédula ya está registrada
    if (cedula) {
      const cedulaExistente = await Usuario.findOne({ where: { cedula } });
      if (cedulaExistente) {
        return res.status(400).json(errorResponse('La identificación (cédula) ya está registrada.', 400));
      }
    }

    // Encripta la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Crea el nuevo usuario en la base de datos
    const nuevoUsuario = await Usuario.create({
      rol_id,
      nombre,
      apellido,
      cedula,
      correo_electronico,
      password_hash,
      telefono,
      direccion,
      pais,
      fecha_nacimiento,
      genero,
      avatar_url
    });

    const datosRespuesta = {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      apellido: nuevoUsuario.apellido,
      cedula: nuevoUsuario.cedula,
      correo_electronico: nuevoUsuario.correo_electronico,
      telefono: nuevoUsuario.telefono,
      direccion: nuevoUsuario.direccion,
      pais: nuevoUsuario.pais,
      fecha_nacimiento: nuevoUsuario.fecha_nacimiento,
      genero: nuevoUsuario.genero,
      avatar_url: nuevoUsuario.avatar_url,
      rol_id: nuevoUsuario.rol_id
    };

    return res.status(201).json(successResponse(datosRespuesta, 'Usuario registrado exitosamente'));

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json(errorResponse('El correo o la identificación ya están registrados.', 400));
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json(errorResponse(error.errors[0].message, 400));
    }

    return res.status(500).json(errorResponse('Ocurrió un error al registrar el usuario.', 500, error.message));
  }
};

/**
 * @function iniciarSesion
 * @description Autentica a un usuario, genera un token JWT y configura una cookie HttpOnly segura para el manejo de la sesión.
 */
const iniciarSesion = async (req, res) => {
  try {
    const { correo_electronico, password } = req.body;

    if (!correo_electronico || !password) {
      return res.status(400).json(errorResponse('Correo electrónico y contraseña son requeridos.', 400));
    }

    const usuario = await Usuario.findOne({ where: { correo_electronico } });
    if (!usuario) {
      return res.status(401).json(errorResponse('Correo o contraseña incorrectos.', 401));
    }

    if (usuario.status !== 'ACTIVO') {
      return res.status(403).json(errorResponse('La cuenta no está activa.', 403));
    }

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json(errorResponse('Contraseña incorrecta.', 401));
    }

    // GENERACIÓN REAL DE JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        rol_id: usuario.rol_id, 
        email: usuario.correo_electronico,
        nombre: usuario.nombre 
      },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    const expiresInHours = parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '2', 10);

    // CONFIGURACIÓN DE COOKIE SEGURA
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expiresInHours * 60 * 60 * 1000 // dinámico en milisegundos
    });

    const expira_en = new Date();
    expira_en.setHours(expira_en.getHours() + expiresInHours);

    await Sesion.create({
      usuario_id: usuario.id,
      token,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      expira_en,
      activa: true
    });

    const payloadRespuesta = {
      token, // Frontend uses res.data.data.token
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        cedula: usuario.cedula,
        correo_electronico: usuario.correo_electronico,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        pais: usuario.pais,
        fecha_nacimiento: usuario.fecha_nacimiento,
        genero: usuario.genero,
        avatar_url: usuario.avatar_url,
        rol_id: usuario.rol_id
      }
    };

    return res.status(200).json(successResponse(payloadRespuesta, 'Inicio de sesión exitoso'));

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json(errorResponse('Error en el servidor al iniciar sesión.', 500, error.message));
  }
};

/**
 * @function cerrarSesion
 * @description Finaliza la sesión del usuario invalidando el token JWT (blacklist) y borrando la cookie.
 */
const cerrarSesion = async (req, res) => {
  try {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!token) {
      return res.status(400).json(errorResponse('Token no proporcionado.', 400));
    }

    const sesion = await Sesion.findOne({ where: { token, activa: true } });
    
    if (sesion) {
      await sesion.update({ activa: false });
      await TokenBlacklist.create({
        usuario_id: sesion.usuario_id,
        token,
        motivo: 'logout'
      });
    }

    // LIMPIAR COOKIE
    res.clearCookie('token');

    return res.status(200).json(successResponse(null, 'Sesión cerrada exitosamente.'));

  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return res.status(500).json(errorResponse('Ocurrió un error al cerrar la sesión.', 500, error.message));
  }
};

/**
 * @function getProfile
 * @description Devuelve los datos básicos del perfil del usuario actualmente autenticado basado en su token JWT.
 */
const getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: [
        'id', 'nombre', 'apellido', 'correo_electronico', 'rol_id', 'avatar_url',
        'telefono', 'cedula', 'fecha_nacimiento', 'genero', 'direccion', 'pais'
      ]
    });
    if (!usuario) return res.status(404).json(errorResponse('Usuario no encontrado.', 404));

    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correoElectronico: usuario.correo_electronico,
      correo_electronico: usuario.correo_electronico,
      rol: usuario.rol_id,
      rol_id: usuario.rol_id,
      fotoPerfil: usuario.avatar_url || null,
      telefono: usuario.telefono || null,
      cedula: usuario.cedula || null,
      fecha_nacimiento: usuario.fecha_nacimiento || null,
      fechaNacimiento: usuario.fecha_nacimiento || null,
      genero: usuario.genero || null,
      direccion: usuario.direccion || null,
      pais: usuario.pais || null
    };

    return res.status(200).json(successResponse(payload, 'OK'));
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return res.status(500).json(errorResponse('Error al obtener el perfil.', 500, error.message));
  }
};

/**
 * @function updateProfile
 * @description Permite al usuario actualizar sus propios datos y cambiar su contraseña (requiere la contraseña actual).
 */
const updateProfile = async (req, res) => {
  try {
    const { nombre, correoElectronico, passwordActual, passwordNuevo } = req.body;

    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario) return res.status(404).json(errorResponse('Usuario no encontrado.', 404));

    const updates = {};
    if (nombre)             updates.nombre = nombre;
    if (correoElectronico)  updates.correo_electronico = correoElectronico;

    // Cambio de contraseña — requiere validar la contraseña actual
    if (passwordNuevo) {
      if (!passwordActual) {
        return res.status(400).json(errorResponse('Debes proporcionar tu contraseña actual para cambiarla.', 400));
      }
      const passwordValido = await bcrypt.compare(passwordActual, usuario.password_hash);
      if (!passwordValido) {
        return res.status(401).json(errorResponse('La contraseña actual es incorrecta.', 401));
      }
      const salt = await bcrypt.genSalt(10);
      updates.password_hash = await bcrypt.hash(passwordNuevo, salt);
    }

    await usuario.update(updates);

    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
      correoElectronico: usuario.correo_electronico,
      rol: usuario.rol_id
    };

    return res.status(200).json(successResponse(payload, 'Perfil actualizado correctamente'));
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return res.status(500).json(errorResponse('Error al actualizar el perfil.', 500, error.message));
  }
};

/**
 * @function solicitarRecuperacion
 * @description Solicita un enlace de recuperación de contraseña para un usuario. Genera un token aleatorio con expiración y lo envía por correo.
 */
const solicitarRecuperacion = async (req, res) => {
  try {
    const { correo_electronico } = req.body;

    const usuario = await Usuario.findOne({ where: { correo_electronico } });

    if (usuario) {
      // Generar token
      const token = crypto.randomBytes(32).toString('hex');
      // Hashear token para guardarlo de manera segura en DB
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      // Expiración en 15 minutos
      const tokenExpires = new Date(Date.now() + 15 * 60 * 1000);

      // Guardar en base de datos
      await usuario.update({
        reset_password_token: hashedToken,
        reset_password_expires: tokenExpires
      });

      // Enviar correo electrónico
      await sendResetPasswordEmail(usuario.correo_electronico, usuario.nombre, token);

      // En modo desarrollo, guardar el token bruto a un archivo para facilitar pruebas sin servidor de correo
      if (process.env.NODE_ENV === 'development') {
        const fs = require('fs');
        const path = require('path');
        fs.writeFileSync(path.join(__dirname, '../reset_token_test.txt'), token);
      }
    }

    // Por seguridad, siempre retornamos éxito para no revelar si el correo está registrado o no
    return res.status(200).json(successResponse(null, 'Si tu correo electrónico está registrado, recibirás un enlace de recuperación en los próximos minutos.'));
  } catch (error) {
    console.error('Error al solicitar recuperación de contraseña:', error);
    return res.status(500).json(errorResponse('Error al procesar la solicitud de recuperación de contraseña.', 500, error.message));
  }
};

/**
 * @function restablecerContrasena
 * @description Restablece la contraseña de un usuario mediante un token válido y no expirado.
 */
const restablecerContrasena = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Hashear el token recibido para buscarlo en la DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar el usuario que tenga este token y que no haya expirado
    const { Op } = require('sequelize');
    const usuario = await Usuario.findOne({
      where: {
        reset_password_token: hashedToken,
        reset_password_expires: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!usuario) {
      return res.status(400).json(errorResponse('El enlace de recuperación es inválido o ha expirado.', 400));
    }

    // Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Actualizar usuario
    await usuario.update({
      password_hash,
      reset_password_token: null,
      reset_password_expires: null
    });

    // Revocar todas las sesiones activas de este usuario para mayor seguridad
    await Sesion.update(
      { activa: false },
      { where: { usuario_id: usuario.id } }
    );

    return res.status(200).json(successResponse(null, 'Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.'));
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    return res.status(500).json(errorResponse('Error al restablecer la contraseña.', 500, error.message));
  }
};

/**
 * @function getMe
 * @description Devuelve el usuario autenticado con datos de perfil para la sesión activa.
 */
const getMe = async (req, res) => {
  try {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(200).json({ usuario: null });

    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id, {
      attributes: { exclude: ['password_hash', 'reset_password_token', 'reset_password_expires'] }
    });
    if (!usuario) return res.status(200).json({ usuario: null });

    return res.status(200).json({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        cedula: usuario.cedula,
        correo_electronico: usuario.correo_electronico,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        pais: usuario.pais,
        fecha_nacimiento: usuario.fecha_nacimiento,
        genero: usuario.genero,
        avatar_url: usuario.avatar_url,
        rol_id: usuario.rol_id
      }
    });
  } catch {
    return res.status(200).json({ usuario: null });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion,
  cerrarSesion,
  getMe,
  getProfile,
  updateProfile,
  solicitarRecuperacion,
  restablecerContrasena
};
