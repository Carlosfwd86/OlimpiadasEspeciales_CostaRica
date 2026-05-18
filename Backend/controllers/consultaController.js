const { models } = require('../config/database');
const { Consulta } = models;

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
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function getById
 * @description Devuelve los detalles de una consulta específica buscándola por su ID.
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Consulta no encontrado' });
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function create
 * @description Crea un nuevo registro de consulta en la base de datos a partir del cuerpo de la petición.
 */
exports.create = async (req, res, next) => {
  try {
    const data = await Consulta.create(req.body);
    res.status(201).json(data);
  } catch (error) { next(error); }
};

/**
 * @function update
 * @description Actualiza los datos de una consulta existente (ej. marcar como leída o respondida).
 */
exports.update = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Consulta no encontrado' });
    await data.update(req.body);
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function delete
 * @description Elimina permanentemente una consulta de la base de datos por su ID.
 */
exports.delete = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Consulta no encontrado' });
    await data.destroy();
    res.json({ message: 'Consulta eliminado' });
  } catch (error) { next(error); }
};
