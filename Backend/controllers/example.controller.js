const { successResponse, errorResponse } = require('../utils/responseFormatter');
// const { User } = require('../models');

const getAll = async (req, res, next) => {
  try {
    // Ejemplo de lógica
    // const items = await User.findAll();
    const items = [];
    return res.status(200).json(successResponse('Datos obtenidos correctamente', items));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = req.body;
    // const newItem = await User.create(data);
    const newItem = data;
    return res.status(201).json(successResponse('Registro creado exitosamente', newItem));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  create
};
