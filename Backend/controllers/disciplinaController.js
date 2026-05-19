const { models } = require('../config/database');
const { Disciplina } = models;
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @module disciplinaController
 * @description Controlador para gestionar el CRUD de disciplinas deportivas.
 */

/**
 * @function getAll
 * @description Obtiene el listado completo de disciplinas registradas.
 */
exports.getAll = async (req, res, next) => {
  try {
    const data = await Disciplina.findAll();
    return res.status(200).json(successResponse(data, 'Disciplinas obtenidas'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al obtener disciplinas', 500, error.message));
  }
};

/**
 * @function getById
 * @description Devuelve los datos de una disciplina específica buscándola por su ID.
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await Disciplina.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('Disciplina no encontrada', 404));
    return res.status(200).json(successResponse(data, 'Disciplina obtenida'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al obtener disciplina', 500, error.message));
  }
};

/**
 * @function create
 * @description Registra una nueva disciplina deportiva en la base de datos.
 */
exports.create = async (req, res, next) => {
  try {
    const data = await Disciplina.create(req.body);
    return res.status(201).json(successResponse(data, 'Disciplina creada'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al crear disciplina', 500, error.message));
  }
};

/**
 * @function update
 * @description Modifica el nombre u otros atributos de una disciplina existente.
 */
exports.update = async (req, res, next) => {
  try {
    const data = await Disciplina.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('Disciplina no encontrada', 404));
    await data.update(req.body);
    return res.status(200).json(successResponse(data, 'Disciplina actualizada'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al actualizar disciplina', 500, error.message));
  }
};

/**
 * @function delete
 * @description Elimina permanentemente una disciplina de la base de datos por su ID.
 */
exports.delete = async (req, res, next) => {
  try {
    const data = await Disciplina.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('Disciplina no encontrada', 404));
    await data.destroy();
    return res.status(200).json(successResponse(null, 'Disciplina eliminada'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al eliminar disciplina', 500, error.message));
  }
};
