const { Voluntario, VoluntarioArea } = require('../models');

// Controlador para la gestión de Voluntarios
const voluntarioController = {

  // Obtener todos los voluntarios con sus áreas de interés
  obtenerTodos: async (req, res) => {
    try {
      // Se incluyen las áreas relacionadas mediante el modelo VoluntarioArea
      const voluntarios = await Voluntario.findAll({
        include: [{ model: VoluntarioArea }]
      });
      return res.status(200).json({
        ok: true,
        data: voluntarios
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al obtener los voluntarios',
        error: error.message
      });
    }
  },

  // Obtener un voluntario por ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const voluntario = await Voluntario.findByPk(id, {
        include: [{ model: VoluntarioArea }]
      });

      if (!voluntario) {
        return res.status(404).json({
          ok: false,
          msg: 'Voluntario no encontrado'
        });
      }

      return res.status(200).json({
        ok: true,
        data: voluntario
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al buscar el voluntario',
        error: error.message
      });
    }
  },

  // Crear un voluntario y sus áreas asociadas
  crear: async (req, res) => {
    try {
      const { areas, ...datosVoluntario } = req.body;
      
      // Creación del voluntario principal
      const nuevoVoluntario = await Voluntario.create(datosVoluntario);

      // Si se enviaron áreas, se registran vinculadas al nuevo voluntario
      if (areas && Array.isArray(areas)) {
        const areasPromesas = areas.map(area => 
          VoluntarioArea.create({ voluntario_id: nuevoVoluntario.id, area })
        );
        await Promise.all(areasPromesas);
      }

      return res.status(201).json({
        ok: true,
        msg: 'Voluntario registrado con éxito',
        data: nuevoVoluntario
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al registrar el voluntario',
        error: error.message
      });
    }
  },

  // Actualizar datos del voluntario
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const voluntario = await Voluntario.findByPk(id);

      if (!voluntario) {
        return res.status(404).json({
          ok: false,
          msg: 'Voluntario no encontrado para actualizar'
        });
      }

      await voluntario.update(req.body);
      return res.status(200).json({
        ok: true,
        msg: 'Voluntario actualizado correctamente'
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al actualizar voluntario',
        error: error.message
      });
    }
  },

  // Eliminar un voluntario (las áreas se borran por CASCADE en BD)
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const borrado = await Voluntario.destroy({ where: { id } });

      if (borrado === 0) {
        return res.status(404).json({
          ok: false,
          msg: 'El registro no existe'
        });
      }

      return res.status(200).json({
        ok: true,
        msg: 'Voluntario eliminado'
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al eliminar registro',
        error: error.message
      });
    }
  }
};

module.exports = voluntarioController;
