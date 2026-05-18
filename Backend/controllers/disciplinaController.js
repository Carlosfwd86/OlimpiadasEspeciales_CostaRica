const { models } = require('../config/database');
const { Disciplina } = models;

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
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function getById
 * @description Devuelve los datos de una disciplina específica buscándola por su ID.
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await Disciplina.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Disciplina no encontrado' });
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function create
 * @description Registra una nueva disciplina deportiva en la base de datos.
 */
exports.create = async (req, res, next) => {
  try {
    const data = await Disciplina.create(req.body);
    res.status(201).json(data);
  } catch (error) { next(error); }
};

/**
 * @function update
 * @description Modifica el nombre u otros atributos de una disciplina existente.
 */
exports.update = async (req, res, next) => {
  try {
    const data = await Disciplina.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Disciplina no encontrado' });
    await data.update(req.body);
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function delete
 * @description Elimina permanentemente una disciplina de la base de datos por su ID.
 */
exports.delete = async (req, res, next) => {
  try {
    const data = await Disciplina.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Disciplina no encontrado' });
    await data.destroy();
    res.json({ message: 'Disciplina eliminado' });
  } catch (error) { next(error); }
};
