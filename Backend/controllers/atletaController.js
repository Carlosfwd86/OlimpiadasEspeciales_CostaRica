const Atleta = require('../models/Atleta');
const AtletaDocumento = require('../models/AtletaDocumento');
const AtletaMedicamento = require('../models/AtletaMedicamento');
const AtletaCondicion = require('../models/AtletaCondicion');
const AtletaDispositivo = require('../models/AtletaDispositivo');
const AtletaAlergia = require('../models/AtletaAlergia');


// [verde] Controlador para gestionar la lógica de negocio de los Atletas
const atletaController = {

  // [verde] Obtener todos los atletas con su información relacionada
  obtenerTodosLosAtletas: async (req, res) => {
    try {
      const atletas = await Atleta.findAll({
        include: [
          { model: AtletaDocumento, as: 'documentos' },
          { model: AtletaMedicamento, as: 'medicamentos' },
          { model: AtletaCondicion, as: 'condiciones' },
          { model: AtletaDispositivo, as: 'dispositivos' },
          { model: AtletaAlergia, as: 'alergias' }
        ]
      });
      res.status(200).json(atletas);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener los atletas', error: error.message });
    }
  },

  // [verde] Obtener un atleta específico por su ID
  obtenerAtletaPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const atleta = await Atleta.findByPk(id, {
        include: [
          { model: AtletaDocumento, as: 'documentos' },
          { model: AtletaMedicamento, as: 'medicamentos' },
          { model: AtletaCondicion, as: 'condiciones' },
          { model: AtletaDispositivo, as: 'dispositivos' },
          { model: AtletaAlergia, as: 'alergias' }
        ]
      });

      if (!atleta) {
        return res.status(44).json({ mensaje: 'Atleta no encontrado' });
      }

      res.status(200).json(atleta);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener el atleta', error: error.message });
    }
  },

  // [verde] Crear un nuevo atleta
  crearAtleta: async (req, res) => {
    try {
      const nuevoAtleta = await Atleta.create(req.body);
      res.status(201).json({ mensaje: 'Atleta creado exitosamente', data: nuevoAtleta });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ mensaje: 'Error de validación', errores: error.errors.map(e => e.message) });
      }
      res.status(500).json({ mensaje: 'Error al crear el atleta', error: error.message });
    }
  },

  // [verde] Actualizar la información de un atleta
  actualizarAtleta: async (req, res) => {
    try {
      const { id } = req.params;
      const [actualizado] = await Atleta.update(req.body, { where: { id } });

      if (actualizado) {
        const atletaActualizado = await Atleta.findByPk(id);
        return res.status(200).json({ mensaje: 'Atleta actualizado correctamente', data: atletaActualizado });
      }
      
      res.status(404).json({ mensaje: 'Atleta no encontrado para actualizar' });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ mensaje: 'Error de validación', errores: error.errors.map(e => e.message) });
      }
      res.status(500).json({ mensaje: 'Error al actualizar el atleta', error: error.message });
    }
  },

  // [verde] Eliminar un atleta del sistema
  eliminarAtleta: async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await Atleta.destroy({ where: { id } });

      if (eliminado) {
        return res.status(200).json({ mensaje: 'Atleta eliminado correctamente' });
      }

      res.status(404).json({ mensaje: 'Atleta no encontrado' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar el atleta', error: error.message });
    }
  }
};

module.exports = atletaController;
