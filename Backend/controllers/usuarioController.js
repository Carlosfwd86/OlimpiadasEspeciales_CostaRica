const { models } = require('../config/database');
const { Usuario, Rol } = models;

const usuarioController = {
  // Obtener todos los usuarios (para gestión administrativa)
  getAll: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        include: [{ model: Rol, as: 'rol' }],
        attributes: { exclude: ['password_hash'] }
      });
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Buscar por filtros (ej: correo_electronico)
  getByFilter: async (req, res) => {
    try {
      const { correo_electronico } = req.query;
      const where = {};
      if (correo_electronico) where.correo_electronico = correo_electronico;

      const usuarios = await Usuario.findAll({ where, attributes: ['id', 'nombre', 'correo_electronico'] });
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Obtener por ID
  getById: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id, {
        attributes: { exclude: ['password_hash'] }
      });
      if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Actualizar usuario
  update: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });
      
      await usuario.update(req.body);
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Eliminar usuario
  delete: async (req, res) => {
    try {
      const deleted = await Usuario.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ msg: 'No se pudo eliminar' });
      return res.status(200).json({ msg: 'Eliminado correctamente' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = usuarioController;
