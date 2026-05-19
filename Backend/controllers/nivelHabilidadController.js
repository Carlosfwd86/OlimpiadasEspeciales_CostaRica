const { models } = require('../config/database');
const { NivelHabilidad } = models;
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @module nivelHabilidadController
 * @description Controlador para gestionar el CRUD de niveles de habilidad.
 */

/**
 * @function getAll
 * @description Obtiene todos los niveles de habilidad.
 */
exports.getAll = async (req, res, next) => {
  try {
    const data = await NivelHabilidad.findAll();
    return res.status(200).json(successResponse(data, 'Niveles de habilidad obtenidos'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al obtener niveles de habilidad', 500, error.message));
  }
};

/**
 * @function getById
 * @description Busca y devuelve un nivel de habilidad por su ID.
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await NivelHabilidad.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('NivelHabilidad no encontrado', 404));
    return res.status(200).json(successResponse(data, 'Nivel de habilidad obtenido'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al obtener nivel de habilidad', 500, error.message));
  }
};

/**
 * @function create
 * @description Registra un nuevo nivel de habilidad.
 */
exports.create = async (req, res, next) => {
  try {
    const data = await NivelHabilidad.create(req.body);
    return res.status(201).json(successResponse(data, 'Nivel de habilidad creado'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al crear nivel de habilidad', 500, error.message));
  }
};

/**
 * @function update
 * @description Actualiza un nivel de habilidad existente.
 */
exports.update = async (req, res, next) => {
  try {
    const data = await NivelHabilidad.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('NivelHabilidad no encontrado', 404));
    await data.update(req.body);
    return res.status(200).json(successResponse(data, 'Nivel de habilidad actualizado'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al actualizar nivel de habilidad', 500, error.message));
  }
};

/**
 * @function delete
 * @description Borra un nivel de habilidad de la base de datos.
 */
exports.delete = async (req, res, next) => {
  try {
    const data = await NivelHabilidad.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('NivelHabilidad no encontrado', 404));
    await data.destroy();
    return res.status(200).json(successResponse(null, 'Nivel de habilidad eliminado'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al eliminar nivel de habilidad', 500, error.message));
  }
};
