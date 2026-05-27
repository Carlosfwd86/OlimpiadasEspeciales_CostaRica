const bcrypt = require('bcryptjs');
const { models } = require('../config/database');
const { Usuario, Rol } = models;
const { successResponse, errorResponse, getPagination, getPagingData } = require('../utils/apiResponse');

/**
 * @module usuarioController
 * @description Controlador general para gestionar usuarios de la plataforma (excluyendo lógicas de autenticación).
 */
const usuarioController = {
  /**
   * @function getAll
   * @description Recupera todos los usuarios y sus roles asociados, excluyendo las contraseñas, para paneles administrativos.
   */
  getAll: async (req, res) => {
    try {
      const { limit, offset, page } = getPagination(req.query);
      const { count, rows: usuarios } = await Usuario.findAndCountAll({
        include: [{ model: Rol, as: 'rol' }],
        attributes: { exclude: ['password_hash'] },
        limit,
        offset
      });
      const meta = getPagingData(count, limit, page);
      return res.status(200).json(successResponse(usuarios, 'Usuarios obtenidos correctamente', meta));
    } catch (error) {
      return res.status(500).json(errorResponse(error.message));
    }
  },

  /**
   * @function getByFilter
   * @description Filtra usuarios de forma dinámica (ej. por correo_electronico) y devuelve campos básicos.
   */
  getByFilter: async (req, res) => {
    try {
      const { correo_electronico } = req.query;
      if (!correo_electronico) {
        return res.status(400).json(errorResponse('El parámetro correo_electronico es requerido.', 400));
      }
      const { limit, offset, page } = getPagination(req.query);

      const where = { correo_electronico };

      const { count, rows: usuarios } = await Usuario.findAndCountAll({ 
        where, 
        attributes: ['id', 'nombre', 'correo_electronico'],
        limit,
        offset 
      });
      const meta = getPagingData(count, limit, page);
      
      return res.status(200).json(successResponse(usuarios, 'Usuarios filtrados obtenidos', meta));
    } catch (error) {
      return res.status(500).json(errorResponse(error.message));
    }
  },

  /**
   * @function getById
   * @description Obtiene el detalle de un usuario específico sin incluir el hash de su contraseña.
   */
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json(errorResponse('El ID del usuario es requerido.', 400));
      const usuario = await Usuario.findByPk(id, {
        attributes: { exclude: ['password_hash'] }
      });
      if (!usuario) return res.status(404).json(errorResponse('Usuario no encontrado', 404));
      return res.status(200).json(successResponse(usuario, 'Usuario obtenido correctamente'));
    } catch (error) {
      return res.status(500).json(errorResponse(error.message));
    }
  },

  /**
   * @function update
   * @description Actualiza campos específicos de un usuario (como avatar, teléfono, etc.) mapeando el payload.
   */
  update: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json(errorResponse('El ID del usuario es requerido.', 400));

      if (Object.keys(req.body).length === 0) {
        return res.status(400).json(errorResponse('No se proporcionaron datos para actualizar.', 400));
      }

      const usuario = await Usuario.findByPk(id);
      if (!usuario) return res.status(404).json(errorResponse('Usuario no encontrado', 404));
      
      const data = req.body;
      const updates = {};
      
      // Mapeo de campos
      if (data.nombre) updates.nombre = data.nombre;
      if (data.apellido) updates.apellido = data.apellido;
      if (data.cedula) updates.cedula = data.cedula;
      if (data.correoElectronico || data.correo_electronico) updates.correo_electronico = data.correoElectronico || data.correo_electronico;
      if (data.telefono) updates.telefono = data.telefono;
      if (data.direccion) updates.direccion = data.direccion;
      if (data.pais) updates.pais = data.pais;
      if (data.fechaNacimiento || data.fecha_nacimiento) updates.fecha_nacimiento = data.fechaNacimiento || data.fecha_nacimiento;
      if (data.genero) updates.genero = data.genero;
      if (data.avatarUrl || data.avatar_url) {
        const inputAvatar = data.avatarUrl || data.avatar_url;
        if (inputAvatar && inputAvatar.startsWith('data:image/')) {
          const s3Service = require('../services/s3Service');
          if (usuario.avatar_url) {
            await s3Service.deleteOldAvatar(usuario.avatar_url);
          }
          updates.avatar_url = await s3Service.uploadAvatar(usuario.id, inputAvatar);
        } else {
          updates.avatar_url = inputAvatar;
        }
      }
      if (data.rol_id) updates.rol_id = data.rol_id;
      else if (data.rol) {
        const rolMap = { admin: 1, atleta: 2, entrenador: 3, voluntario: 4, tutor: 5 };
        if (rolMap[data.rol]) updates.rol_id = rolMap[data.rol];
      }
      if (data.status) updates.status = data.status;
      if (data.equipo) updates.equipo = data.equipo;
      if (data.experiencia) updates.experiencia = data.experiencia;
      if (data.proximosRetos || data.proximos_retos) updates.proximos_retos = data.proximosRetos || data.proximos_retos;

      if (data.password && data.password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        updates.password_hash = await bcrypt.hash(data.password, salt);
      }

      await usuario.update(updates);
      return res.status(200).json(successResponse(usuario, 'Usuario actualizado correctamente'));
    } catch (error) {
      return res.status(500).json(errorResponse(error.message));
    }
  },

  /**
   * @function delete
   * @description Elimina físicamente a un usuario del sistema por su ID.
   */
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json(errorResponse('El ID del usuario es requerido.', 400));

      const { sequelize } = require('../config/database');
      
      // Limpiar referencias para evitar errores de Foreign Key (FK constraint)
      await sequelize.query('DELETE FROM token_blacklist WHERE usuario_id = :id', { replacements: { id } });
      
      const tablesToCheck = ['sesiones'];
      for (const table of tablesToCheck) {
        try { await sequelize.query(`DELETE FROM ${table} WHERE usuario_id = :id`, { replacements: { id } }); } catch(e) {}
      }

      const updateTables = ['atletas', 'entrenadores', 'voluntarios', 'tutores', 'consultas', 'logauditoria', 'transacciones'];
      for (const table of updateTables) {
        try { await sequelize.query(`UPDATE ${table} SET usuario_id = NULL WHERE usuario_id = :id`, { replacements: { id } }); } catch(e) {}
      }

      try { await sequelize.query(`UPDATE facturas SET id_cajero = NULL WHERE id_cajero = :id`, { replacements: { id } }); } catch(e) {}
      try { await sequelize.query(`UPDATE facturas SET id_cliente = NULL WHERE id_cliente = :id`, { replacements: { id } }); } catch(e) {}
      try { await sequelize.query(`UPDATE resenas SET id_usuario = NULL WHERE id_usuario = :id`, { replacements: { id } }); } catch(e) {}

      const deleted = await Usuario.destroy({ where: { id } });
      if (!deleted) return res.status(404).json(errorResponse('Usuario no encontrado o ya eliminado.', 404));
      return res.status(200).json(successResponse(null, 'Usuario eliminado correctamente'));
    } catch (error) {
      return res.status(500).json(errorResponse(error.message));
    }
  }
};

module.exports = usuarioController;
