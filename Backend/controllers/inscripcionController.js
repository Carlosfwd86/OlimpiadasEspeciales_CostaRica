const { models } = require('../config/database');
const { Inscripcion } = models;

/**
 * @module inscripcionController
 * @description Controlador para gestionar el CRUD de inscripciones.
 */

/**
 * @function getAll
 * @description Obtiene el listado completo de inscripciones.
 */
exports.getAll = async (req, res, next) => {
  try {
    const data = await Inscripcion.findAll();
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function getById
 * @description Devuelve los datos de una inscripción específica buscándola por su ID.
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await Inscripcion.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Inscripcion no encontrado' });
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function create
 * @description Crea un nuevo registro de inscripción.
 */
exports.create = async (req, res, next) => {
  try {
    const data = await Inscripcion.create(req.body);
    res.status(201).json(data);
  } catch (error) { next(error); }
};

/**
 * @function update
 * @description Modifica los atributos de una inscripción existente.
 */
exports.update = async (req, res, next) => {
  try {
    const data = await Inscripcion.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Inscripcion no encontrado' });
    await data.update(req.body);
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function delete
 * @description Elimina permanentemente una inscripción de la base de datos por su ID.
 */
exports.delete = async (req, res, next) => {
  try {
    const data = await Inscripcion.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Inscripcion no encontrado' });
    await data.destroy();
    res.json({ message: 'Inscripcion eliminado' });
  } catch (error) { next(error); }
};
