const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { models } = require('../config/database');
const { Usuario, Sesion, TokenBlacklist } = models;

// Función para registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
  try {
    const { rol_id, nombre, apellido, cedula, correo_electronico, password, telefono, direccion, pais, fecha_nacimiento, genero, avatar_url } = req.body;

    // Verifica si el correo ya está registrado
    const correoExistente = await Usuario.findOne({ where: { correo_electronico } });
    if (correoExistente) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso.' });
    }

    // Verifica si la cédula ya está registrada
    if (cedula) {
      const cedulaExistente = await Usuario.findOne({ where: { cedula } });
      if (cedulaExistente) {
        return res.status(400).json({ error: 'La identificación (cédula) ya está registrada.' });
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

    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo_electronico: nuevoUsuario.correo_electronico
      }
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El correo o la identificación ya están registrados.' });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors[0].message });
    }

    return res.status(500).json({ error: 'Ocurrió un error al registrar el usuario.' });
  }
};

// Función para iniciar sesión
const iniciarSesion = async (req, res) => {
  try {
    const { correo_electronico, password } = req.body;

    const usuario = await Usuario.findOne({ where: { correo_electronico } });
    if (!usuario) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    if (usuario.status !== 'ACTIVO') {
      return res.status(403).json({ error: 'La cuenta no está activa.' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    // GENERACIÓN REAL DE JWT
    const token = jwt.sign(
      { id: usuario.id, rol_id: usuario.rol_id, email: usuario.correo_electronico },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '2h' }
    );

    // CONFIGURACIÓN DE COOKIE SEGURA
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000 // 2 horas
    });

    const expira_en = new Date();
    expira_en.setHours(expira_en.getHours() + 2);

    await Sesion.create({
      usuario_id: usuario.id,
      token,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      expira_en,
      activa: true
    });

    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token, // Se mantiene por compatibilidad
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol_id: usuario.rol_id
      }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ error: 'Error en el servidor al iniciar sesión.' });
  }
};

// Función para cerrar sesión
const cerrarSesion = async (req, res) => {
  try {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!token) {
      return res.status(400).json({ error: 'Token no proporcionado.' });
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

    return res.status(200).json({ mensaje: 'Sesión cerrada exitosamente.' });

  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return res.status(500).json({ error: 'Ocurrió un error al cerrar la sesión.' });
  }
};

// Función para obtener el perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: ['id', 'nombre', 'apellido', 'correo_electronico', 'rol_id', 'avatar_url', 'telefono']
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado.' });

    return res.status(200).json({
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correoElectronico: usuario.correo_electronico,
        rol: usuario.rol_id,
        fotoPerfil: usuario.avatar_url || null,
        telefono: usuario.telefono || null
      },
      message: 'OK',
      status: 200
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return res.status(500).json({ error: 'Error al obtener el perfil.' });
  }
};

// Función para actualizar el perfil del usuario autenticado
const updateProfile = async (req, res) => {
  try {
    const { nombre, correoElectronico, passwordActual, passwordNuevo } = req.body;

    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado.' });

    const updates = {};
    if (nombre)             updates.nombre = nombre;
    if (correoElectronico)  updates.correo_electronico = correoElectronico;

    // Cambio de contraseña — requiere validar la contraseña actual
    if (passwordNuevo) {
      if (!passwordActual) {
        return res.status(400).json({ message: 'Debes proporcionar tu contraseña actual para cambiarla.' });
      }
      const passwordValido = await bcrypt.compare(passwordActual, usuario.password_hash);
      if (!passwordValido) {
        return res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
      }
      const salt = await bcrypt.genSalt(10);
      updates.password_hash = await bcrypt.hash(passwordNuevo, salt);
    }

    await usuario.update(updates);

    return res.status(200).json({
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        correoElectronico: usuario.correo_electronico,
        rol: usuario.rol_id
      },
      message: 'Perfil actualizado correctamente',
      status: 200
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return res.status(500).json({ error: 'Error al actualizar el perfil.' });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion,
  cerrarSesion,
  getProfile,
  updateProfile
};
