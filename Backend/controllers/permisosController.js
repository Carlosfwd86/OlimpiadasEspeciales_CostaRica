const { models } = require('../config/database');
const { Permiso } = models;

// Función para obtener todos los permisos
const obtenerPermisos = async (req, res) => {
  try {
    // Lista todos los permisos registrados
    const permisos = await Permiso.findAll();
    return res.status(200).json(permisos);
  } catch (error) {
    console.error('Error al obtener los permisos:', error);
    return res.status(500).json({ error: 'Ocurrió un error al obtener los permisos.' });
  }
};

// Función para crear un nuevo permiso
const crearPermiso = async (req, res) => {
  try {
    const { nombre, ruta, metodo, descripcion } = req.body;

    // Verifica si ya existe un permiso con el mismo nombre
    const permisoExistente = await Permiso.findOne({ where: { nombre } });
    if (permisoExistente) {
      return res.status(400).json({ error: 'El permiso ya existe.' });
    }

    // Crea el permiso
    const nuevoPermiso = await Permiso.create({ nombre, ruta, metodo, descripcion });
    return res.status(201).json({
      mensaje: 'Permiso creado exitosamente',
      permiso: nuevoPermiso
    });
  } catch (error) {
    console.error('Error al crear el permiso:', error);
    return res.status(500).json({ error: 'Ocurrió un error al crear el permiso.' });
  }
};

// Función para eliminar un permiso
const eliminarPermiso = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca el permiso a eliminar
    const permiso = await Permiso.findByPk(id);
    if (!permiso) {
      return res.status(404).json({ error: 'Permiso no encontrado.' });
    }

    // Procede con la eliminación
    await permiso.destroy();
    return res.status(200).json({ mensaje: 'Permiso eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar el permiso:', error);
    return res.status(500).json({ error: 'Ocurrió un error al eliminar el permiso.' });
  }
};

module.exports = {
  obtenerPermisos,
  crearPermiso,
  eliminarPermiso
};
