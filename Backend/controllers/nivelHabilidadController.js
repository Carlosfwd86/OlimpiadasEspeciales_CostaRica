const { NivelHabilidad } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const data = await NivelHabilidad.findAll();
    res.json(data);
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await NivelHabilidad.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'NivelHabilidad no encontrado' });
    res.json(data);
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await NivelHabilidad.create(req.body);
    res.status(201).json(data);
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const data = await NivelHabilidad.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'NivelHabilidad no encontrado' });
    await data.update(req.body);
    res.json(data);
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    const data = await NivelHabilidad.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'NivelHabilidad no encontrado' });
    await data.destroy();
    res.json({ message: 'NivelHabilidad eliminado' });
  } catch (error) { next(error); }
};
