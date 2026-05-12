const { models } = require('../config/database');
const { Disciplina } = models;

exports.getAll = async (req, res, next) => {
  try {
    const data = await Disciplina.findAll();
    res.json(data);
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await Disciplina.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Disciplina no encontrado' });
    res.json(data);
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await Disciplina.create(req.body);
    res.status(201).json(data);
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const data = await Disciplina.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Disciplina no encontrado' });
    await data.update(req.body);
    res.json(data);
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    const data = await Disciplina.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Disciplina no encontrado' });
    await data.destroy();
    res.json({ message: 'Disciplina eliminado' });
  } catch (error) { next(error); }
};
