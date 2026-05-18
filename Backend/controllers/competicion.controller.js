const { models } = require('../config/database');
const { Competicion, CompeticionAtleta } = models;

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
      const competiciones = await Competicion.findAll();
      return res.status(200).json({
        ok: true,
        data: competiciones
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al consultar competiciones',
        error: error.message
      });
    }
  },

  /**
   * @function obtenerPorId
   * @description Busca y devuelve los datos detallados de una competición específica usando su ID.
   */
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const competicion = await Competicion.findByPk(id);

      if (!competicion) {
        return res.status(404).json({
          ok: false,
          msg: 'Competición no encontrada'
        });
      }

      return res.status(200).json({
        ok: true,
        data: competicion
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al buscar competición',
        error: error.message
      });
    }
  },

  /**
   * @function crear
   * @description Registra una nueva competición en el sistema.
   */
  crear: async (req, res) => {
    try {
      const nuevaCompeticion = await Competicion.create(req.body);
      return res.status(201).json({
        ok: true,
        msg: 'Competición creada correctamente',
        data: nuevaCompeticion
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al crear la competición',
        error: error.message
      });
    }
  },

  /**
   * @function actualizar
   * @description Modifica los atributos de una competición existente identificada por su ID.
   */
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const competicion = await Competicion.findByPk(id);

      if (!competicion) {
        return res.status(404).json({
          ok: false,
          msg: 'No existe la competición indicada'
        });
      }

      await competicion.update(req.body);
      return res.status(200).json({
        ok: true,
        msg: 'Competición actualizada'
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al actualizar registro',
        error: error.message
      });
    }
  },

  /**
   * @function eliminar
   * @description Elimina permanentemente una competición de la base de datos.
   */
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const borrado = await Competicion.destroy({ where: { id } });

      if (borrado === 0) {
        return res.status(404).json({
          ok: false,
          msg: 'Competición no encontrada'
        });
      }

      return res.status(200).json({
        ok: true,
        msg: 'Competición eliminada con éxito'
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al eliminar competición',
        error: error.message
      });
    }
  },

  /**
   * @function inscribirAtleta
   * @description Crea un vínculo en la tabla pivote para inscribir a un atleta en una competición, permitiendo registrar posición y resultado.
   */
  inscribirAtleta: async (req, res) => {
    try {
      const { competicion_id, atleta_id, posicion, resultado } = req.body;
      
      // Registro en la tabla pivote
      const inscripcion = await CompeticionAtleta.create({
        competicion_id,
        atleta_id,
        posicion,
        resultado
      });

      return res.status(201).json({
        ok: true,
        msg: 'Atleta inscrito exitosamente en la competición',
        data: inscripcion
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al inscribir atleta',
        error: error.message
      });
    }
  }
};

module.exports = competicionController;
