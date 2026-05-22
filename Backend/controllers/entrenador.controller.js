const { models } = require('../config/database');
const { Entrenador } = models;
const { successResponse, errorResponse, getPagination, getPagingData } = require('../utils/apiResponse');
const { handleDbError } = require('../utils/dbErrors');

/**
 * @module entrenadorController
 * @description Controlador para administrar la información y el ciclo de vida de los entrenadores en el sistema.
 */
const entrenadorController = {

  /**
   * @function obtenerTodos
   * @description Recupera la lista completa de entrenadores registrados en la plataforma.
   */
  obtenerTodos: async (req, res) => {
    try {
      const { limit, offset, page } = getPagination(req.query);
      const { count, rows: entrenadores } = await Entrenador.findAndCountAll({
        limit,
        offset
      });
      const meta = getPagingData(count, limit, page);
      return res.status(200).json(successResponse(entrenadores, 'Entrenadores obtenidos correctamente', meta));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al obtener la lista de entrenadores', 500, error.message));
    }
  },

  /**
   * @function obtenerPorId
   * @description Busca y devuelve el detalle completo de un entrenador utilizando su ID.
   */
  obtenerPorId: async (req, res) => {
    try {
      let { id } = req.params;
      if (!id) return res.status(400).json(errorResponse('El ID del entrenador es requerido.', 400));
      if (typeof id === 'string' && id.includes('_')) {
        id = id.split('_')[1];
      }
      const entrenador = await Entrenador.findByPk(id);

      if (!entrenador) {
        return res.status(404).json(errorResponse('Entrenador no encontrado en el sistema', 404));
      }

      return res.status(200).json(successResponse(entrenador, 'Entrenador obtenido correctamente'));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al buscar el entrenador', 500, error.message));
    }
  },

  /**
   * @function crear
   * @description Registra un nuevo entrenador, mapeando los datos de la solicitud (camelCase) a los campos del modelo (snake_case) y asociando la disciplina principal.
   */
  crear: async (req, res) => {
    try {
      const data = req.body.datos || req.body;
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json(errorResponse('No se proporcionaron datos para crear el entrenador.', 400));
      }

      let primerNombre = data.nombre || '';
      let apellido = data.apellido || '';
      
      if (!apellido && primerNombre.includes(' ')) {
        const partes = primerNombre.trim().split(' ');
        primerNombre = partes[0];
        apellido = partes.slice(1).join(' ');
      }
      if (!apellido) apellido = 'N/A';

      let disciplinaId = null;
      if (data.disciplinaPrincipal) {
        const { Disciplina } = require('../config/database').models;
        const disc = await Disciplina.findOne({ where: { nombre: data.disciplinaPrincipal } });
        if (disc) disciplinaId = disc.id;
      }

      const datosEntrenador = {
        usuario_id: req.body.usuario_id || null,
        disciplina_id: disciplinaId,
        nombre: primerNombre,
        apellido: apellido,
        cedula: data.cedula || null,
        fecha_nacimiento: data.fechaNacimiento || data.fecha_nacimiento || null,
        genero: data.genero || null,
        telefono: data.telefono || null,
        correo_electronico: data.correoElectronico || data.correo_electronico || null,
        direccion: data.direccion || null,
        pais: data.pais || null,
        emergencia_nombre: data.emergenciaNombre || data.emergencia_nombre || null,
        emergencia_telefono: data.emergenciaTelefono || data.emergencia_telefono || null,
        anios_experiencia: parseInt(data.aniosExperiencia || data.anios_experiencia || 0, 10),
        certificaciones: data.certificaciones || null,
        horario_disponible: data.horarioDisponible || data.horario_disponible || null,
        afeccion_salud: data.afeccionSalud === 'Si',
        detalle_salud: data.detalleSalud || data.detalle_salud || null,
        status: req.body.status || 'PENDIENTE',
        fecha_aprobacion: req.body.fecha_aprobacion || null
      };

      const nuevoEntrenador = await Entrenador.create(datosEntrenador);
      return res.status(201).json(successResponse(nuevoEntrenador, 'Entrenador registrado exitosamente'));
    } catch (error) {
      // Manejo de errores de validación de Sequelize
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json(errorResponse('Error en los datos proporcionados', 400, error.errors.map(err => err.message)));
      }
      if (handleDbError(res, error, 'Error interno al registrar el entrenador')) return;
      return res.status(500).json(errorResponse('Error interno al registrar el entrenador', 500, error.message));
    }
  },

  /**
   * @function actualizar
   * @description Actualiza la información de un entrenador existente, soportando tanto campos en camelCase como en snake_case enviados desde el frontend.
   */
  actualizar: async (req, res) => {
    try {
      let { id } = req.params;
      if (!id) return res.status(400).json(errorResponse('El ID del entrenador es requerido.', 400));
      if (typeof id === 'string' && id.includes('_')) {
        id = id.split('_')[1];
      }

      const entrenador = await Entrenador.findByPk(id);

      if (!entrenador) {
        return res.status(404).json(errorResponse('No se encontró el entrenador para actualizar', 404));
      }

      const data = req.body;
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json(errorResponse('No se proporcionaron datos para actualizar.', 400));
      }
      const updates = {};
      
      if (data.nombre) {
        let primerNombre = data.nombre;
        let apellido = data.apellido || '';
        if (!apellido && primerNombre.includes(' ')) {
          const partes = primerNombre.trim().split(' ');
          primerNombre = partes[0];
          apellido = partes.slice(1).join(' ');
        }
        updates.nombre = primerNombre;
        if (apellido) updates.apellido = apellido;
      }
      
      if (data.fechaNacimiento || data.fecha_nacimiento) updates.fecha_nacimiento = data.fechaNacimiento || data.fecha_nacimiento;
      if (data.genero) updates.genero = data.genero;
      if (data.telefono) updates.telefono = data.telefono;
      if (data.correoElectronico || data.correo_electronico) updates.correo_electronico = data.correoElectronico || data.correo_electronico;
      if (data.cedula) updates.cedula = data.cedula;
      if (data.pais) updates.pais = data.pais;
      if (data.direccion) updates.direccion = data.direccion;
      if (data.aniosExperiencia || data.anios_experiencia) updates.anios_experiencia = data.aniosExperiencia || data.anios_experiencia;
      if (data.certificaciones) updates.certificaciones = data.certificaciones;
      if (data.horarioDisponible || data.horario_disponible) updates.horario_disponible = data.horarioDisponible || data.horario_disponible;
      if (data.afeccionSalud !== undefined) updates.afeccion_salud = data.afeccionSalud === 'Si' || data.afeccionSalud === true;
      if (data.detalleSalud || data.detalle_salud) updates.detalle_salud = data.detalleSalud || data.detalle_salud;
      if (data.equipo) updates.equipo = data.equipo;
      if (data.proximosRetos || data.proximos_retos) updates.proximos_retos = data.proximosRetos || data.proximos_retos;

      // Actualización de los campos enviados
      await entrenador.update(updates);
      return res.status(200).json(successResponse(entrenador, 'Datos del entrenador actualizados correctamente'));
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json(errorResponse('Error de validación', 400, error.errors.map(e => e.message)));
      }
      if (handleDbError(res, error, 'Error al actualizar el registro')) return;
      return res.status(500).json(errorResponse('Error al actualizar el registro', 500, error.message));
    }
  },

  /**
   * @function eliminar
   * @description Borra el registro de un entrenador de la base de datos usando su identificador único.
   */
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json(errorResponse('El ID del entrenador es requerido.', 400));
      const resultado = await Entrenador.destroy({ where: { id } });

      if (resultado === 0) {
        return res.status(404).json(errorResponse('El entrenador no existe o ya fue eliminado', 404));
      }

      return res.status(200).json(successResponse(null, 'Entrenador removido exitosamente'));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al intentar eliminar el entrenador', 500, error.message));
    }
  }
};

module.exports = entrenadorController;
