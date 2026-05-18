const { models } = require('../config/database');
const { NivelHabilidad } = models;

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
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function getById
 * @description Busca y devuelve un nivel de habilidad por su ID.
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await NivelHabilidad.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'NivelHabilidad no encontrado' });
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function create
 * @description Registra un nuevo nivel de habilidad.
 */
exports.create = async (req, res, next) => {
  try {
    const data = await NivelHabilidad.create(req.body);
    res.status(201).json(data);
  } catch (error) { next(error); }
};

/**
 * @function update
 * @description Actualiza un nivel de habilidad existente.
 */
exports.update = async (req, res, next) => {
  try {
    const data = await NivelHabilidad.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'NivelHabilidad no encontrado' });
    await data.update(req.body);
    res.json(data);
  } catch (error) { next(error); }
};

/**
 * @function delete
 * @description Borra un nivel de habilidad de la base de datos.
 */
exports.delete = async (req, res, next) => {
  try {
    const data = await NivelHabilidad.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'NivelHabilidad no encontrado' });
    await data.destroy();
    res.json({ message: 'NivelHabilidad eliminado' });
  } catch (error) { next(error); }
};
