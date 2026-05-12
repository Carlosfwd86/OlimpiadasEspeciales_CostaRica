const { models } = require('../config/database');
const { Rol } = models;

// Función para obtener todos los roles
const obtenerRoles = async (req, res) => {
  try {
    // Obtiene todos los roles de la base de datos
    const roles = await Rol.findAll();
    return res.status(200).json(roles);
  } catch (error) {
    // Maneja cualquier error inesperado
    console.error('Error al obtener los roles:', error);
    return res.status(500).json({ error: 'Ocurrió un error al obtener los roles.' });
  }
};

// Función para crear un nuevo rol
const crearRol = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // Verifica si el rol ya existe
    const rolExistente = await Rol.findOne({ where: { nombre } });
    if (rolExistente) {
      return res.status(400).json({ error: 'El rol ya existe.' });
    }

    // Crea el rol en la base de datos
    const nuevoRol = await Rol.create({ nombre, descripcion });
    return res.status(201).json({
      mensaje: 'Rol creado exitosamente',
      rol: nuevoRol
    });
  } catch (error) {
    // Maneja errores de validación y de servidor
    console.error('Error al crear el rol:', error);
    return res.status(500).json({ error: 'Ocurrió un error al crear el rol.' });
  }
};

// Función para actualizar un rol existente
const actualizarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    // Busca el rol por su id
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado.' });
    }

    // Actualiza los datos
    await rol.update({ nombre, descripcion });
    return res.status(200).json({
      mensaje: 'Rol actualizado exitosamente',
      rol
    });
  } catch (error) {
    console.error('Error al actualizar el rol:', error);
    return res.status(500).json({ error: 'Ocurrió un error al actualizar el rol.' });
  }
};

// Función para eliminar un rol
const eliminarRol = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca el rol a eliminar
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado.' });
    }

    // Elimina el rol de la base de datos
    await rol.destroy();
    return res.status(200).json({ mensaje: 'Rol eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar el rol:', error);
    return res.status(500).json({ error: 'Ocurrió un error al eliminar el rol.' });
  }
};

module.exports = {
  obtenerRoles,
  crearRol,
  actualizarRol,
  eliminarRol
};
