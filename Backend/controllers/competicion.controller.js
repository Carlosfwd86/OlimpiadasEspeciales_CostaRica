const { models } = require('../config/database');
const { Competicion, CompeticionAtleta } = models;
const { successResponse, errorResponse, getPagination, getPagingData } = require('../utils/apiResponse');

/**
 * @module competicionController
 * @description Controlador para el manejo del ciclo de vida de competiciones y la asignación de atletas.
 */
const competicionController = {

  /**
   * @function obtenerTodas
   * @description Recupera la lista completa de competiciones, ya sea programadas o finalizadas.
   */
  obtenerTodas: async (req, res) => {
    try {
      const { limit, offset, page } = getPagination(req.query);
      const { count, rows: competiciones } = await Competicion.findAndCountAll({
        limit,
        offset
      });
      const meta = getPagingData(count, limit, page);
      return res.status(200).json(successResponse(competiciones, 'Competiciones obtenidas correctamente', meta));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al consultar competiciones', 500, error.message));
    }
  },

  /**
   * @function obtenerPorId
   * @description Busca y devuelve los datos detallados de una competición específica usando su ID.
   */
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json(errorResponse('El ID de la competición es requerido.', 400));
      const competicion = await Competicion.findByPk(id);

      if (!competicion) {
        return res.status(404).json(errorResponse('Competición no encontrada', 404));
      }

      return res.status(200).json(successResponse(competicion, 'Competición obtenida'));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al buscar competición', 500, error.message));
    }
  },

  /**
   * @function crear
   * @description Registra una nueva competición en el sistema.
   */
  crear: async (req, res) => {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json(errorResponse('No se proporcionaron datos para crear la competición.', 400));
      }
      const nuevaCompeticion = await Competicion.create(req.body);
      return res.status(201).json(successResponse(nuevaCompeticion, 'Competición creada correctamente'));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al crear la competición', 500, error.message));
    }
  },

  /**
   * @function actualizar
   * @description Modifica los atributos de una competición existente identificada por su ID.
   */
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json(errorResponse('El ID de la competición es requerido.', 400));
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json(errorResponse('No se proporcionaron datos para actualizar.', 400));
      }
      const competicion = await Competicion.findByPk(id);

      if (!competicion) {
        return res.status(404).json(errorResponse('No existe la competición indicada', 404));
      }

      await competicion.update(req.body);
      return res.status(200).json(successResponse(competicion, 'Competición actualizada'));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al actualizar registro', 500, error.message));
    }
  },

  /**
   * @function eliminar
   * @description Elimina permanentemente una competición de la base de datos.
   */
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json(errorResponse('El ID de la competición es requerido.', 400));
      const borrado = await Competicion.destroy({ where: { id } });

      if (borrado === 0) {
        return res.status(404).json(errorResponse('Competición no encontrada', 404));
      }

      return res.status(200).json(successResponse(null, 'Competición eliminada con éxito'));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al eliminar competición', 500, error.message));
    }
  },

  /**
   * @function inscribirAtleta
   * @description Crea un vínculo en la tabla pivote para inscribir a un atleta en una competición, permitiendo registrar posición y resultado.
   */
  inscribirAtleta: async (req, res) => {
    try {
      const { competicion_id, atleta_id, posicion, resultado } = req.body;
      if (!competicion_id || !atleta_id) {
        return res.status(400).json(errorResponse('El ID de la competición y del atleta son requeridos.', 400));
      }
      
      // Registro en la tabla pivote
      const inscripcion = await CompeticionAtleta.create({
        competicion_id,
        atleta_id,
        posicion,
        resultado
      });

      return res.status(201).json(successResponse(inscripcion, 'Atleta inscrito exitosamente en la competición'));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al inscribir atleta', 500, error.message));
    }
  }
};

module.exports = competicionController;
