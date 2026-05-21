const { models } = require('../config/database');
const { Consulta } = models;
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @module consultaController
 * @description Controlador para gestionar el CRUD de consultas de usuarios (ej. mensajes del formulario de contacto).
 */

/**
 * @function getAll
 * @description Obtiene el listado de todas las consultas registradas en el sistema.
 */
exports.getAll = async (req, res, next) => {
  try {
    const data = await Consulta.findAll();
    return res.status(200).json(successResponse(data, 'Consultas obtenidas'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al obtener consultas', 500, error.message));
  }
};

/**
 * @function getById
 * @description Devuelve los detalles de una consulta específica buscándola por su ID.
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('Consulta no encontrada', 404));
    return res.status(200).json(successResponse(data, 'Consulta obtenida'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al obtener consulta', 500, error.message));
  }
};

/**
 * @function create
 * @description Crea un nuevo registro de consulta en la base de datos a partir del cuerpo de la petición.
 */
exports.create = async (req, res, next) => {
  try {
    const data = await Consulta.create(req.body);
    return res.status(201).json(successResponse(data, 'Consulta creada'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al crear consulta', 500, error.message));
  }
};

/**
 * @function update
 * @description Actualiza los datos de una consulta existente (ej. marcar como leída o respondida).
 */
exports.update = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('Consulta no encontrada', 404));
    await data.update(req.body);
    return res.status(200).json(successResponse(data, 'Consulta actualizada'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al actualizar consulta', 500, error.message));
  }
};

/**
 * @function delete
 * @description Elimina permanentemente una consulta de la base de datos por su ID.
 */
exports.delete = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('Consulta no encontrada', 404));
    await data.destroy();
    return res.status(200).json(successResponse(null, 'Consulta eliminada'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al eliminar consulta', 500, error.message));
  }
};
