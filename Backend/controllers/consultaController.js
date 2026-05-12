const { models } = require('../config/database');
const { Consulta } = models;

exports.getAll = async (req, res, next) => {
  try {
    const data = await Consulta.findAll();
    res.json(data);
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Consulta no encontrado' });
    res.json(data);
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await Consulta.create(req.body);
    res.status(201).json(data);
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Consulta no encontrado' });
    await data.update(req.body);
    res.json(data);
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Consulta no encontrado' });
    await data.destroy();
    res.json({ message: 'Consulta eliminado' });
  } catch (error) { next(error); }
};
