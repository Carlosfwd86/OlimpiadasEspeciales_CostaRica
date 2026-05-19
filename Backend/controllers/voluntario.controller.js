const { models } = require('../config/database');
const { Voluntario, VoluntarioArea } = models;
const { successResponse, errorResponse, getPagination, getPagingData } = require('../utils/apiResponse');

/**
 * @module voluntarioController
 * @description Controlador para gestionar el ciclo de vida de los voluntarios, sus datos personales y estados de aprobación.
 */
const voluntarioController = {

  /**
   * @function obtenerTodos
   * @description Recupera la lista completa de voluntarios, incluyendo las áreas de interés en las que desean participar.
   */
  obtenerTodos: async (req, res) => {
    try {
      const { limit, offset, page } = getPagination(req.query);
      const { count, rows: voluntarios } = await Voluntario.findAndCountAll({
        include: [{ model: VoluntarioArea }],
        distinct: true,
        limit,
        offset
      });
      const meta = getPagingData(count, limit, page);
      return res.status(200).json(successResponse(voluntarios, 'Voluntarios obtenidos correctamente', meta));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al obtener los voluntarios', 500, error.message));
    }
  },

  /**
   * @function obtenerPorId
   * @description Obtiene los detalles de un voluntario específico por su ID y carga sus áreas de interés vinculadas.
   */
  obtenerPorId: async (req, res) => {
    try {
      let { id } = req.params;
      if (typeof id === 'string' && id.includes('_')) {
        id = id.split('_')[1];
      }

      const voluntario = await Voluntario.findByPk(id, {
        include: [{ model: VoluntarioArea }]
      });

      if (!voluntario) {
        return res.status(404).json(errorResponse('Voluntario no encontrado', 404));
      }

      return res.status(200).json(successResponse(voluntario, 'Voluntario obtenido'));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al buscar el voluntario', 500, error.message));
    }
  },

  /**
   * @function crear
   * @description Registra un nuevo voluntario, normaliza los datos (camelCase a snake_case) e inserta simultáneamente sus áreas de interés.
   */
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

      const datosVoluntario = {
        usuario_id: req.body.usuario_id || null,
        nombre: primerNombre,
        apellido: apellido,
        cedula: data.cedula || null,
        fecha_nacimiento: data.fechaNacimiento || data.fecha_nacimiento || null,
        genero: data.genero || null,
        telefono: data.telefono || null,
        correo_electronico: data.correoElectronico || data.correo_electronico || null,
        direccion: data.direccion || null,
        pais: data.pais || null,
        otra_area: data.otraArea || data.otra_area || null,
        disponibilidad: data.disponibilidad || null,
        experiencia_previa: data.experienciaPrevia || data.experiencia_previa || null,
        status: req.body.status || 'PENDIENTE',
        fecha_aprobacion: req.body.fecha_aprobacion || null
      };
      
      // Creación del voluntario principal
      const nuevoVoluntario = await Voluntario.create(datosVoluntario);

      // Si se enviaron áreas, se registran vinculadas al nuevo voluntario
      const areas = data.areasInteres || data.areas || [];
      if (areas && Array.isArray(areas)) {
        const areasPromesas = areas.map(area => 
          VoluntarioArea.create({ voluntario_id: nuevoVoluntario.id, area })
        );
        await Promise.all(areasPromesas);
      }

      return res.status(201).json(successResponse(nuevoVoluntario, 'Voluntario registrado con éxito'));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al registrar el voluntario', 500, error.message));
    }
  },

  /**
   * @function actualizar
   * @description Modifica la información personal de un voluntario existente mapeando correctamente los nombres de atributos.
   */
  actualizar: async (req, res) => {
    try {
      let { id } = req.params;
      if (typeof id === 'string' && id.includes('_')) {
        id = id.split('_')[1];
      }

      const voluntario = await Voluntario.findByPk(id);

      if (!voluntario) {
        return res.status(404).json(errorResponse('Voluntario no encontrado para actualizar', 404));
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
      if (data.disponibilidad) updates.disponibilidad = data.disponibilidad;
      if (data.experienciaPrevia || data.experiencia_previa) updates.experiencia_previa = data.experienciaPrevia || data.experiencia_previa;
      if (data.equipo) updates.equipo = data.equipo;
      if (data.proximosRetos || data.proximos_retos) updates.proximos_retos = data.proximosRetos || data.proximos_retos;

      await voluntario.update(updates);
      return res.status(200).json(successResponse(voluntario, 'Voluntario actualizado correctamente'));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al actualizar voluntario', 500, error.message));
    }
  },

  /**
   * @function eliminar
   * @description Borra el registro principal de un voluntario. Las áreas asociadas se eliminan en cascada desde la base de datos.
   */
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const borrado = await Voluntario.destroy({ where: { id } });

      if (borrado === 0) {
        return res.status(404).json(errorResponse('El registro no existe', 404));
      }

      return res.status(200).json(successResponse(null, 'Voluntario eliminado'));
    } catch (error) {
      return res.status(500).json(errorResponse('Error al eliminar registro', 500, error.message));
    }
  },

  /**
   * @function aprobar
   * @description Cambia el estado de un voluntario a 'ACTIVO' y registra la fecha en que fue aprobado por el administrador.
   */
  aprobar: async (req, res) => {
    try {
      const { id } = req.params;
      const voluntario = await Voluntario.findByPk(id);
      if (!voluntario) return res.status(404).json(errorResponse('No encontrado', 404));

      await voluntario.update({ 
        status: 'ACTIVO', 
        fecha_aprobacion: new Date() 
      });
      
      return res.status(200).json(successResponse(voluntario, 'Voluntario aprobado'));
    } catch (error) {
      return res.status(500).json(errorResponse(error.message));
    }
  },

  /**
   * @function rechazar
   * @description Cambia el estado de un voluntario a 'INACTIVO' (rechazado).
   */
  rechazar: async (req, res) => {
    try {
      const { id } = req.params;
      const voluntario = await Voluntario.findByPk(id);
      if (!voluntario) return res.status(404).json(errorResponse('No encontrado', 404));

      await voluntario.update({ status: 'INACTIVO' });
      return res.status(200).json(successResponse(voluntario, 'Voluntario rechazado'));
    } catch (error) {
      return res.status(500).json(errorResponse(error.message));
    }
  }
};

module.exports = voluntarioController;
