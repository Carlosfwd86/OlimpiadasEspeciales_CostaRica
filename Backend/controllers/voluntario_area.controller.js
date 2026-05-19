const { models } = require('../config/database');
const { VoluntarioArea } = models;
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * @module voluntarioAreaController
 * @description Controlador para gestionar la relación (áreas de interés) asociadas a los voluntarios.
 */
const voluntarioAreaController = {

  /**
   * @function obtenerTodas
   * @description Recupera todos los registros de áreas de interés vinculadas a voluntarios.
   */
  obtenerTodas: async (req, res) => {
    try {
      const areas = await VoluntarioArea.findAll();
      return res.status(200).json(successResponse('Áreas obtenidas correctamente', areas));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al obtener áreas', error.message));
    }
  },

  /**
   * @function crear
   * @description Registra una nueva área de interés para un voluntario específico.
   */
  crear: async (req, res) => {
    try {
      const nuevaArea = await VoluntarioArea.create(req.body);
      return res.status(201).json(successResponse('Área registrada con éxito', nuevaArea));
    } catch (error) {
      return res.status(400).json(errorResponse('Error al registrar área', error.message));
    }
  },

  /**
   * @function eliminar
   * @description Borra el registro de un área de interés específica mediante su ID.
   */
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const borrado = await VoluntarioArea.destroy({ where: { id } });
      if (borrado === 0) return res.status(404).json(errorResponse('Área no encontrada'));
      return res.status(200).json(successResponse('Área eliminada correctamente'));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al eliminar área', error.message));
    }
  }
};

module.exports = voluntarioAreaController;
