const { Programa } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const data = await Programa.findAll();
    res.json(data);
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await Programa.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Programa no encontrado' });
    res.json(data);
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await Programa.create(req.body);
    res.status(201).json(data);
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const data = await Programa.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Programa no encontrado' });
    await data.update(req.body);
    res.json(data);
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    const data = await Programa.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Programa no encontrado' });
    await data.destroy();
    res.json({ message: 'Programa eliminado' });
  } catch (error) { next(error); }
};
