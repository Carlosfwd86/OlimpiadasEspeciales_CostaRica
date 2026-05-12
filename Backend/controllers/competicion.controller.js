const { models } = require('../config/database');
const { Competicion, CompeticionAtleta } = models;

// Controlador para la gestión de Competiciones
const competicionController = {

  // Obtener todas las competiciones programadas o finalizadas
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

  // Obtener detalle de una competición por su ID
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

  // Crear una nueva competición
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

  // Actualizar datos de una competición
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

  // Eliminar una competición
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

  // Método especial para inscribir un atleta en una competición
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
