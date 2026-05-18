const { models } = require('../config/database');
const { CompeticionAtleta } = models;
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * @module competicionAtletaController
 * @description Controlador para gestionar la relación muchos a muchos entre competiciones y atletas (inscripciones, posiciones, resultados).
 */
const competicionAtletaController = {

  /**
   * @function obtenerTodas
   * @description Recupera todos los registros de inscripción de atletas en competiciones.
   */
  obtenerTodas: async (req, res) => {
    try {
      const registros = await CompeticionAtleta.findAll();
      return res.status(200).json(successResponse('Registros de competición obtenidos', registros));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al obtener registros', error.message));
    }
  },

  /**
   * @function crear
   * @description Registra la inscripción de un atleta en una competición específica, junto con su posición o resultado.
   */
  crear: async (req, res) => {
    try {
      const registro = await CompeticionAtleta.create(req.body);
      return res.status(201).json(successResponse('Atleta inscrito exitosamente', registro));
    } catch (error) {
      return res.status(400).json(errorResponse('Error al inscribir atleta', error.message));
    }
  },

  /**
   * @function actualizar
   * @description Modifica el resultado o posición de una inscripción existente.
   */
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const registro = await CompeticionAtleta.findByPk(id);
      if (!registro) return res.status(404).json(errorResponse('Registro no encontrado'));
      
      await registro.update(req.body);
      return res.status(200).json(successResponse('Resultado actualizado correctamente', registro));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al actualizar resultado', error.message));
    }
  },

  /**
   * @function eliminar
   * @description Borra el registro de una inscripción (desvincula a un atleta de una competición).
   */
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const borrado = await CompeticionAtleta.destroy({ where: { id } });
      if (borrado === 0) return res.status(404).json(errorResponse('Inscripción no encontrada'));
      return res.status(200).json(successResponse('Inscripción eliminada'));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al eliminar inscripción', error.message));
    }
  }
};

module.exports = competicionAtletaController;
