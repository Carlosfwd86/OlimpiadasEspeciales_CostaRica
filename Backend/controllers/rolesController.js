const { models } = require('../config/database');
const { Rol } = models;
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @module rolesController
 * @description Controlador para gestionar el CRUD y las validaciones de roles de usuario.
 */

/**
 * @function obtenerRoles
 * @description Recupera la lista completa de roles del sistema.
 */
const obtenerRoles = async (req, res) => {
  try {
    // Obtiene todos los roles de la base de datos
    const roles = await Rol.findAll();
    return res.status(200).json(successResponse(roles, 'Roles obtenidos correctamente'));
  } catch (error) {
    // Maneja cualquier error inesperado
    console.error('Error al obtener los roles:', error);
    return res.status(500).json(errorResponse('Ocurrió un error al obtener los roles.', 500, error.message));
  }
};

/**
 * @function crearRol
 * @description Registra un nuevo rol. Valida que el nombre del rol no exista previamente.
 */
const crearRol = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) {
      return res.status(400).json(errorResponse('El nombre del rol es requerido.', 400));
    }

    // Verifica si el rol ya existe
    const rolExistente = await Rol.findOne({ where: { nombre } });
    if (rolExistente) {
      return res.status(400).json(errorResponse('El rol ya existe.', 400));
    }

    // Crea el rol en la base de datos
    const nuevoRol = await Rol.create({ nombre, descripcion });
    return res.status(201).json(successResponse(nuevoRol, 'Rol creado exitosamente'));
  } catch (error) {
    // Maneja errores de validación y de servidor
    console.error('Error al crear el rol:', error);
    return res.status(500).json(errorResponse('Ocurrió un error al crear el rol.', 500, error.message));
  }
};

/**
 * @function actualizarRol
 * @description Modifica el nombre y descripción de un rol existente mediante su ID.
 */
const actualizarRol = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json(errorResponse('El ID del rol es requerido.', 400));

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json(errorResponse('No se proporcionaron datos para actualizar el rol.', 400));
    }

    const { nombre, descripcion } = req.body;

    // Busca el rol por su id
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json(errorResponse('Rol no encontrado.', 404));
    }

    // Actualiza los datos
    await rol.update({ nombre, descripcion });
    return res.status(200).json(successResponse(rol, 'Rol actualizado exitosamente'));
  } catch (error) {
    console.error('Error al actualizar el rol:', error);
    return res.status(500).json(errorResponse('Ocurrió un error al actualizar el rol.', 500, error.message));
  }
};

/**
 * @function eliminarRol
 * @description Elimina permanentemente un rol de la base de datos por su ID.
 */
const eliminarRol = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json(errorResponse('El ID del rol es requerido.', 400));

    // Busca el rol a eliminar
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json(errorResponse('Rol no encontrado.', 404));
    }

    // Elimina el rol de la base de datos
    await rol.destroy();
    return res.status(200).json(successResponse(null, 'Rol eliminado exitosamente.'));
  } catch (error) {
    console.error('Error al eliminar el rol:', error);
    return res.status(500).json(errorResponse('Ocurrió un error al eliminar el rol.', 500, error.message));
  }
};

module.exports = {
  obtenerRoles,
  crearRol,
  actualizarRol,
  eliminarRol
};
