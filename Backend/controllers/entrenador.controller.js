const { models } = require('../config/database');
const { Entrenador } = models;

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
      let { id } = req.params;
      if (typeof id === 'string' && id.includes('_')) {
        id = id.split('_')[1];
      }
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
      const data = req.body.datos || req.body;

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
      let { id } = req.params;
      if (typeof id === 'string' && id.includes('_')) {
        id = id.split('_')[1];
      }

      const entrenador = await Entrenador.findByPk(id);

      if (!entrenador) {
        return res.status(404).json({
          ok: false,
          msg: 'No se encontró el entrenador para actualizar'
        });
      }

      const data = req.body;
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

      // Actualización de los campos enviados
      await entrenador.update(updates);
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
