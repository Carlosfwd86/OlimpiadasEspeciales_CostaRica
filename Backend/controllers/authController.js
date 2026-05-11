const bcrypt = require('bcrypt');
const { Usuario, Sesion, TokenBlacklist } = require('../models');

// Función para registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
  try {
    const { rol_id, nombre, apellido, cedula, correo_electronico, password, telefono, direccion, pais, fecha_nacimiento, genero, avatar_url } = req.body;

    // Verifica si el correo ya está registrado
    const usuarioExistente = await Usuario.findOne({ where: { correo_electronico } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso.' });
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

    // Retorna respuesta de éxito sin incluir el hash de la contraseña
    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo_electronico: nuevoUsuario.correo_electronico
      }
    });

  } catch (error) {
    // Maneja cualquier error inesperado
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ error: 'Ocurrió un error al registrar el usuario.' });
  }
};

// Función para iniciar sesión
const iniciarSesion = async (req, res) => {
  try {
    const { correo_electronico, password } = req.body;

    // Busca al usuario por correo electrónico
    const usuario = await Usuario.findOne({ where: { correo_electronico } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Verifica si la cuenta está activa
    if (usuario.status !== 'ACTIVO') {
      return res.status(403).json({ error: 'La cuenta no está activa.' });
    }

    // Compara la contraseña proporcionada con el hash guardado
    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    // Aquí normalmente generaríamos un token JWT, lo simularemos por ahora
    const token = `token_simulado_${usuario.id}_${Date.now()}`;
    const expira_en = new Date();
    expira_en.setHours(expira_en.getHours() + 2); // El token expira en 2 horas

    // Guarda la sesión en la base de datos
    await Sesion.create({
      usuario_id: usuario.id,
      token,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      expira_en,
      activa: true
    });

    // Retorna el token al cliente
    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol_id: usuario.rol_id
      }
    });

  } catch (error) {
    // Captura errores del servidor
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ error: 'Error en el servidor al iniciar sesión.' });
  }
};

// Función para cerrar sesión
const cerrarSesion = async (req, res) => {
  try {
    // Asumimos que el token viene en los headers (Authorization: Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ error: 'Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];

    // Busca la sesión activa correspondiente al token
    const sesion = await Sesion.findOne({ where: { token, activa: true } });
    
    if (sesion) {
      // Invalida la sesión actualizándola en la base de datos
      await sesion.update({ activa: false });
      
      // Agrega el token a la lista negra
      await TokenBlacklist.create({
        usuario_id: sesion.usuario_id,
        token,
        motivo: 'logout'
      });
    }

    // Retorna éxito incluso si la sesión ya no existía (para evitar revelar estado)
    return res.status(200).json({ mensaje: 'Sesión cerrada exitosamente.' });

  } catch (error) {
    // Loguea el error en caso de fallo
    console.error('Error al cerrar sesión:', error);
    return res.status(500).json({ error: 'Ocurrió un error al cerrar la sesión.' });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion,
  cerrarSesion
};
