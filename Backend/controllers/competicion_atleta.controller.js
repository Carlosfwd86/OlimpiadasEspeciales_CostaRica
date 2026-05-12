const { models } = require('../config/database');
const { CompeticionAtleta } = models;
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// Controlador para gestionar la participación de atletas en competiciones (Tabla Pivote)
const competicionAtletaController = {

  // Listar todas las inscripciones y resultados
  obtenerTodas: async (req, res) => {
    try {
      const registros = await CompeticionAtleta.findAll();
      return res.status(200).json(successResponse('Registros de competición obtenidos', registros));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al obtener registros', error.message));
    }
  },

  // Registrar un atleta en una competición con su resultado/posición
  crear: async (req, res) => {
    try {
      const registro = await CompeticionAtleta.create(req.body);
      return res.status(201).json(successResponse('Atleta inscrito exitosamente', registro));
    } catch (error) {
      return res.status(400).json(errorResponse('Error al inscribir atleta', error.message));
    }
  },

  // Actualizar el resultado o posición de un atleta
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

  // Eliminar una inscripción por su ID
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
