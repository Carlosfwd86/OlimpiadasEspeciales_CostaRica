const { models } = require('../config/database');
const { Programa } = models;

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
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function getById
 * @description Busca y devuelve los detalles de un programa específico por su ID.
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await Programa.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Programa no encontrado' });
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function create
 * @description Crea un nuevo programa en el sistema.
 */
exports.create = async (req, res, next) => {
  try {
    const data = await Programa.create(req.body);
    res.status(201).json(data);
  } catch (error) { next(error); }
};

/**
 * @function update
 * @description Actualiza los datos de un programa existente.
 */
exports.update = async (req, res, next) => {
  try {
    const data = await Programa.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Programa no encontrado' });
    await data.update(req.body);
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function delete
 * @description Borra permanentemente un programa de la base de datos por su ID.
 */
exports.delete = async (req, res, next) => {
  try {
    const data = await Programa.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Programa no encontrado' });
    await data.destroy();
    res.json({ message: 'Programa eliminado' });
  } catch (error) { next(error); }
};
