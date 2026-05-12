const { Entrenador } = require('../models');

// Controlador para la gestión de Entrenadores
const entrenadorController = {

  // Obtener todos los entrenadores registrados
  obtenerTodos: async (req, res) => {
    try {
      // Búsqueda de todos los registros en la base de datos
      const entrenadores = await Entrenador.findAll();
      return res.status(200).json({
        ok: true,
        data: entrenadores
      });
    } catch (error) {
      // Captura de errores en la consulta
      return res.status(500).json({
        ok: false,
        msg: 'Error al obtener la lista de entrenadores',
        error: error.message
      });
    }
  },

  // Obtener un entrenador por su ID único
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const entrenador = await Entrenador.findByPk(id);

      if (!entrenador) {
        return res.status(404).json({
          ok: false,
          msg: 'Entrenador no encontrado en el sistema'
        });
      }

      return res.status(200).json({
        ok: true,
        data: entrenador
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al buscar el entrenador',
        error: error.message
      });
    }
  },

  // Registrar un nuevo entrenador
  crear: async (req, res) => {
    try {
      // Creación del registro con los datos del body
      const nuevoEntrenador = await Entrenador.create(req.body);
      return res.status(201).json({
        ok: true,
        msg: 'Entrenador registrado exitosamente',
        data: nuevoEntrenador
      });
    } catch (error) {
      // Manejo de errores de validación de Sequelize
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          ok: false,
          msg: 'Error en los datos proporcionados',
          errors: error.errors.map(err => err.message)
        });
      }
      return res.status(500).json({
        ok: false,
        msg: 'Error interno al registrar el entrenador',
        error: error.message
      });
    }
  },

  // Actualizar datos de un entrenador existente
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const entrenador = await Entrenador.findByPk(id);

      if (!entrenador) {
        return res.status(404).json({
          ok: false,
          msg: 'No se encontró el entrenador para actualizar'
        });
      }

      // Actualización de los campos enviados
      await entrenador.update(req.body);
      return res.status(200).json({
        ok: true,
        msg: 'Datos del entrenador actualizados correctamente',
        data: entrenador
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al actualizar el registro',
        error: error.message
      });
    }
  },

  // Eliminar un entrenador del sistema
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await Entrenador.destroy({ where: { id } });

      if (resultado === 0) {
        return res.status(404).json({
          ok: false,
          msg: 'El entrenador no existe o ya fue eliminado'
        });
      }

      return res.status(200).json({
        ok: true,
        msg: 'Entrenador removido exitosamente'
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: 'Error al intentar eliminar el entrenador',
        error: error.message
      });
    }
  }
};

module.exports = entrenadorController;
