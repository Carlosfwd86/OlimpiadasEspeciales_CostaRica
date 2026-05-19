const { models } = require('../config/database');
const { Programa } = models;
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @module programaController
 * @description Controlador para gestionar el CRUD de programas (ej. Atletas Jóvenes, Salud).
 */

/**
 * @function getAll
 * @description Recupera el listado completo de programas de la organización.
 */
exports.getAll = async (req, res, next) => {
  try {
    const data = await Programa.findAll();
    return res.status(200).json(successResponse(data, 'Programas obtenidos'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al obtener programas', 500, error.message));
  }
};

/**
 * @function getById
 * @description Busca y devuelve los detalles de un programa específico por su ID.
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await Programa.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('Programa no encontrado', 404));
    return res.status(200).json(successResponse(data, 'Programa obtenido'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al obtener programa', 500, error.message));
  }
};

/**
 * @function create
 * @description Crea un nuevo programa en el sistema.
 */
exports.create = async (req, res, next) => {
  try {
    const data = await Programa.create(req.body);
    return res.status(201).json(successResponse(data, 'Programa creado'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al crear programa', 500, error.message));
  }
};

/**
 * @function update
 * @description Actualiza los datos de un programa existente.
 */
exports.update = async (req, res, next) => {
  try {
    const data = await Programa.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('Programa no encontrado', 404));
    await data.update(req.body);
    return res.status(200).json(successResponse(data, 'Programa actualizado'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al actualizar programa', 500, error.message));
  }
};

/**
 * @function delete
 * @description Borra permanentemente un programa de la base de datos por su ID.
 */
exports.delete = async (req, res, next) => {
  try {
    const data = await Programa.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('Programa no encontrado', 404));
    await data.destroy();
    return res.status(200).json(successResponse(null, 'Programa eliminado'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al eliminar programa', 500, error.message));
  }
};
