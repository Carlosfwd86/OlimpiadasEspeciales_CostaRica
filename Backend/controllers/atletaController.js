const { sequelize, models } = require('../config/database');
const { Atleta, Programa, AtletaDocumento, AtletaMedicamento, AtletaCondicion, AtletaDispositivo, AtletaAlergia } = models;
const { Op } = require('sequelize');
const { successResponse, errorResponse, getPagination, getPagingData } = require('../utils/apiResponse');
const { handleDbError } = require('../utils/dbErrors');
const documentoService = require('../services/documentoService');

// [verde] Controlador para gestionar la lógica de negocio de los Atletas
/**
 * @module atletaController
 * @description Controlador para gestionar operaciones CRUD de atletas, incluyendo su información médica y documentos.
 */
const atletaController = {

  /**
   * @function obtenerTodosLosAtletas
   * @description Recupera la lista completa de atletas con sus relaciones (documentos, medicamentos, condiciones, etc.).
   */
  obtenerTodosLosAtletas: async (req, res) => {
    try {
      const { limit, offset, page } = getPagination(req.query);
      const { search } = req.query;

      const whereClause = {};
      if (search) {
        whereClause[Op.or] = [
          { nombre: { [Op.like]: `%${search}%` } },
          { primer_apellido: { [Op.like]: `%${search}%` } },
          { segundo_apellido: { [Op.like]: `%${search}%` } },
          { correo_electronico: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows: atletas } = await Atleta.findAndCountAll({
        where: whereClause,
        include: [
          { model: Programa, as: 'programa', attributes: ['id', 'nombre', 'provincia'] },
          { model: AtletaDocumento, as: 'documentos' },
          { model: AtletaMedicamento, as: 'medicamentos' },
          { model: AtletaCondicion, as: 'condiciones' },
          { model: AtletaDispositivo, as: 'dispositivos' },
          { model: AtletaAlergia, as: 'alergias' }
        ],
        distinct: true,
        limit,
        offset
      });
      const meta = getPagingData(count, limit, page);
      res.status(200).json(successResponse(atletas, 'Atletas obtenidos correctamente', meta));
    } catch (error) {
      res.status(500).json(errorResponse('Error al obtener los atletas', 500, error.message));
    }
  },

  /**
   * @function obtenerAtletaPorId
   * @description Recupera un atleta específico y todas sus relaciones a partir de su ID.
   */
  obtenerAtletaPorId: async (req, res) => {
    try {
      let { id } = req.params;
      if (!id) return res.status(400).json(errorResponse('El ID del atleta es requerido.', 400));
      
      // Manejar el ID si viene como "atleta_4"
      if (typeof id === 'string' && id.includes('_')) {
        id = id.split('_')[1];
      }

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
        return res.status(404).json(errorResponse('Atleta no encontrado', 404));
      }

      res.status(200).json(successResponse(atleta, 'Atleta obtenido correctamente'));
    } catch (error) {
      res.status(500).json(errorResponse('Error al obtener el atleta', 500, error.message));
    }
  },

  /**
   * @function crearAtleta
   * @description Registra un nuevo atleta manejando una transacción SQL para insertar datos, condiciones médicas, alergias, dispositivos y medicamentos simultáneamente.
   */
  crearAtleta: async (req, res) => {
    const t = await require('../config/database').sequelize.transaction();
    try {
      const data = req.body.datos || req.body;
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json(errorResponse('No se proporcionaron datos para crear el atleta.', 400));
      }
      
      // Manejar el caso donde el frontend envía todo en 'nombre'
      let primerNombre = data.nombre || '';
      let primerApellido = data.primer_apellido || '';
      
      if (!primerApellido && primerNombre.includes(' ')) {
        const partes = primerNombre.trim().split(' ');
        primerNombre = partes[0];
        primerApellido = partes.slice(1).join(' ');
      }
      
      if (!primerApellido) primerApellido = 'N/A'; // Evitar error de validación

      // Mapear el payload del frontend a los campos del modelo
      // Resolver ids referenciales si vienen nombres desde frontend
      let disciplinaId = null;
      if (data.disciplina) {
        const { Disciplina } = require('../config/database').models;
        const disc = await Disciplina.findOne({ where: { nombre: data.disciplina } });
        if (disc) disciplinaId = disc.id;
      }
      let nivelHabilidadId = null;
      if (data.nivelHabilidad) {
        const { NivelHabilidad } = require('../config/database').models;
        const nivel = await NivelHabilidad.findOne({ where: { nombre: data.nivelHabilidad } });
        if (nivel) nivelHabilidadId = nivel.id;
      }

      const atletaPayload = {
        nombre: primerNombre,
        primer_apellido: primerApellido,
        segundo_apellido: data.segundo_apellido || null,
        fecha_nacimiento: data.fechaNacimiento || data.fecha_nacimiento || new Date(),
        genero: data.genero || 'Otro',
        telefono: data.telefono || null,
        correo_electronico: data.correoElectronico || data.correo_electronico || null,
        cedula: data.cedula || null,
        pais: data.pais || null,
        direccion: data.direccion || null,
        emergencia_nombre: data.emergenciaNombre || null,
        emergencia_telefono: data.emergenciaTelefono || null,
        tutor_nombre: data.tutorNombre || null,
        tutor_apellido: data.tutorApellido || null,
        tutor_relacion: data.tutorRelacion || null,
        tutor_telefono: data.tutorTelefono || null,
        tutor_correo: data.tutorCorreo || null,
        tutor_pais: data.tutorPais || null,
        tutor_cedula: data.tutorCedula || null
        , disciplina_id: disciplinaId,
        nivel_habilidad_id: nivelHabilidadId,
        req_dietetico: data.reqDietetico || data.req_dietetico || null,
        especificacion_dietetico: data.especificacionDietetico || data.especificacion_dietetico || null,
        otros_dispositivos: data.otrosDispositivos || data.otros_dispositivos || null,
        especificacion_otros_dispositivos: data.especificacionOtrosDispositivos || data.especificacion_otros_dispositivos || null,
        afeccion_cardiaca: (data.afeccionCardiaca === 'Si' || data.afeccionCardiaca === true),
        asma: (data.asma === 'Si' || data.asma === true),
        diabetes: (data.diabetes === 'Si' || data.diabetes === true),
        disc_visual: (data.discVisual === 'Si' || data.discVisual === true),
        disc_auditiva: (data.discAuditiva === 'Si' || data.discAuditiva === true),
        trastorno_hemorragico: (data.trastornoHemorragico === 'Si' || data.trastornoHemorragico === true),
        medico_limito_deportes: (data.medicoLimitoDeportes === 'Si' || data.medicoLimitoDeportes === true),
        epilepsia_convulsivo: (data.epilepsiaConvulsivo === 'Si' || data.epilepsiaConvulsivo === true),
        anemia_depranocitica: (data.anemiaDepranocitica === 'Si' || data.anemiaDepranocitica === true),
        conmocion_cerebral: (data.conmocionCerebral === 'Si' || data.conmocionCerebral === true),
        cantidad_conmociones: data.cantidadConmociones || null,
        fecha_ultima_conmocion: data.fechaUltimaConmocion || null,
        afecciones_mentales: (data.afeccionesMentales === 'Si' || data.afeccionesMentales === true),
        especificacion_afecciones_mentales: data.especificacionAfeccionesMentales || null,
        alergias_graves: (data.alergiasGraves === 'Si' || data.alergiasGraves === true),
        toma_medicamentos: data.tomaMedicamentos || null,
        terminos_aceptados: (data.terminosAceptados === true || data.terminosAceptados === 'true'),
        objecion_tratamiento_medico: (data.objecionTratamientoMedico === true || data.objecionTratamientoMedico === 'true'),
        objecion_transfusiones: (data.objecionTransfusiones === true || data.objecionTransfusiones === 'true'),
        firma_atleta: data.firmaAtleta || null,
        fecha_firma_atleta: data.fechaFirmaAtleta || null,
        firma_tutor: data.firmaTutor || null,
        relacion_tutor: data.relacionTutor || data.relacion_tutor || null,
        fecha_firma_tutor: data.fechaFirmaTutor || null,
        interes_investigacion: data.interesInvestigacion || null,
        relacion_atleta: data.relacionAtleta || null,
        relacion_atleta_otro: data.relacionAtletaOtro || null
      };

      const nuevoAtleta = await Atleta.create(atletaPayload, { transaction: t });

      // Guardar condiciones médicas si existen
      if (data.condicionesMedicas && Array.isArray(data.condicionesMedicas)) {
        for (const cond of data.condicionesMedicas) {
          await AtletaCondicion.create({ atleta_id: nuevoAtleta.id, condicion: cond }, { transaction: t });
        }
      }

      // Guardar medicamentos
      if (data.medicamentos && Array.isArray(data.medicamentos)) {
        for (const med of data.medicamentos) {
          if (med.nombre) {
            await AtletaMedicamento.create({
              atleta_id: nuevoAtleta.id,
              nombre: med.nombre || med.medicamento || 'Sin nombre',
              dosis: med.dosis || '',
              frecuencia: med.frecuencia || ''
            }, { transaction: t });
          }
        }
      }

      // Guardar alergias
      if (data.alergiasGraves === 'Si' && data.tiposAlergia && Array.isArray(data.tiposAlergia)) {
        for (const al of data.tiposAlergia) {
          await AtletaAlergia.create({ 
            atleta_id: nuevoAtleta.id, 
            alergia: al.includes('Otros') ? `Otro: ${data.especificacionAlergiaOtro}` : al 
          }, { transaction: t });
        }
      }

      // Guardar dispositivos con tipo y nombre para el modelo AtletaDispositivo
      const guardarDispositivo = async (items, tipo) => {
        if (!Array.isArray(items)) return;
        for (const nombre of items) {
          if (!nombre || nombre === 'Ninguno') continue;
          await AtletaDispositivo.create({
            atleta_id: nuevoAtleta.id,
            tipo,
            nombre: nombre.toString().trim() || 'Otro'
          }, { transaction: t });
        }
      };

      await guardarDispositivo(data.dispositivosMovilidad, 'movilidad');
      await guardarDispositivo(data.ayudasEstiloVida, 'vida');
      await guardarDispositivo(data.comunicaciones, 'comunicacion');
      await guardarDispositivo(data.dispositivosMedicos, 'medico');

      await t.commit();

      const registroPendienteId =
        data.registro_pendiente_id || data.registroPendienteId || null;
      let documentosMigrados = [];
      if (registroPendienteId) {
        try {
          documentosMigrados = await documentoService.migratePendingToAtleta(
            registroPendienteId,
            nuevoAtleta.id
          );
        } catch (migrateErr) {
          console.error('Error migrando documentos pendientes:', migrateErr);
        }
      }

      res.status(201).json(
        successResponse(
          { ...nuevoAtleta.toJSON(), documentos: documentosMigrados },
          'Atleta creado exitosamente'
        )
      );
    } catch (error) {
      await t.rollback();
      console.error('Error al crear atleta:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json(errorResponse('Error de validación', 400, error.errors.map(e => e.message)));
      }
      if (handleDbError(res, error, 'Error al crear el atleta')) return;
      res.status(500).json(errorResponse('Error al crear el atleta', 500, error.message));
    }
  },

  /**
   * @function actualizarAtleta
   * @description Actualiza los datos de un atleta existente, normalizando el payload recibido (camelCase a snake_case).
   */
  actualizarAtleta: async (req, res) => {
    try {
      let { id } = req.params;
      if (!id) return res.status(400).json(errorResponse('El ID del atleta es requerido.', 400));
      
      // Manejar el ID si viene como "atleta_4"
      if (typeof id === 'string' && id.includes('_')) {
        id = id.split('_')[1];
      }

      const data = req.body;
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json(errorResponse('No se proporcionaron datos para actualizar.', 400));
      }
      
      // Mapeo inteligente de campos camelCase a snake_case
      const updates = {};
      if (data.nombre) {
        let primerNombre = data.nombre;
        let primerApellido = data.primer_apellido || data.apellido || '';
        
        if (!primerApellido && primerNombre.includes(' ')) {
          const partes = primerNombre.trim().split(' ');
          primerNombre = partes[0];
          primerApellido = partes.slice(1).join(' ');
        }
        updates.nombre = primerNombre;
        if (primerApellido) updates.primer_apellido = primerApellido;
      }
      
      if (data.primer_apellido) updates.primer_apellido = data.primer_apellido;
      if (data.segundo_apellido) updates.segundo_apellido = data.segundo_apellido;
      if (data.fechaNacimiento || data.fecha_nacimiento) updates.fecha_nacimiento = data.fechaNacimiento || data.fecha_nacimiento;
      if (data.genero) updates.genero = data.genero;
      if (data.telefono) updates.telefono = data.telefono;
      if (data.correoElectronico || data.correo_electronico) updates.correo_electronico = data.correoElectronico || data.correo_electronico;
      if (data.cedula) updates.cedula = data.cedula;
      if (data.pais) updates.pais = data.pais;
      if (data.direccion) updates.direccion = data.direccion;
      if (data.emergenciaNombre) updates.emergencia_nombre = data.emergenciaNombre;
      if (data.emergenciaTelefono) updates.emergencia_telefono = data.emergenciaTelefono;
      if (data.equipo) updates.equipo = data.equipo;
      if (data.experiencia) updates.experiencia = data.experiencia;
      if (data.proximosRetos || data.proximos_retos) updates.proximos_retos = data.proximosRetos || data.proximos_retos;
      if (data.disciplina) {
        const { Disciplina } = require('../config/database').models;
        const disc = await Disciplina.findOne({ where: { nombre: data.disciplina } });
        if (disc) updates.disciplina_id = disc.id;
      }
      if (data.nivelHabilidad) {
        const { NivelHabilidad } = require('../config/database').models;
        const nivel = await NivelHabilidad.findOne({ where: { nombre: data.nivelHabilidad } });
        if (nivel) updates.nivel_habilidad_id = nivel.id;
      }
      if (data.reqDietetico || data.req_dietetico) updates.req_dietetico = data.reqDietetico || data.req_dietetico;
      if (data.especificacionDietetico || data.especificacion_dietetico) updates.especificacion_dietetico = data.especificacionDietetico || data.especificacion_dietetico;
      if (data.otrosDispositivos || data.otros_dispositivos) updates.otros_dispositivos = data.otrosDispositivos || data.otros_dispositivos;
      if (data.especificacionOtrosDispositivos || data.especificacion_otros_dispositivos) updates.especificacion_otros_dispositivos = data.especificacionOtrosDispositivos || data.especificacion_otros_dispositivos;
      if (data.afeccionCardiaca !== undefined) updates.afeccion_cardiaca = data.afeccionCardiaca === 'Si' || data.afeccionCardiaca === true;
      if (data.asma !== undefined) updates.asma = data.asma === 'Si' || data.asma === true;
      if (data.diabetes !== undefined) updates.diabetes = data.diabetes === 'Si' || data.diabetes === true;
      if (data.discVisual !== undefined) updates.disc_visual = data.discVisual === 'Si' || data.discVisual === true;
      if (data.discAuditiva !== undefined) updates.disc_auditiva = data.discAuditiva === 'Si' || data.discAuditiva === true;
      if (data.trastornoHemorragico !== undefined) updates.trastorno_hemorragico = data.trastornoHemorragico === 'Si' || data.trastornoHemorragico === true;
      if (data.medicoLimitoDeportes !== undefined) updates.medico_limito_deportes = data.medicoLimitoDeportes === 'Si' || data.medicoLimitoDeportes === true;
      if (data.epilepsiaConvulsivo !== undefined) updates.epilepsia_convulsivo = data.epilepsiaConvulsivo === 'Si' || data.epilepsiaConvulsivo === true;
      if (data.anemiaDepranocitica !== undefined) updates.anemia_depranocitica = data.anemiaDepranocitica === 'Si' || data.anemiaDepranocitica === true;
      if (data.conmocionCerebral !== undefined) updates.conmocion_cerebral = data.conmocionCerebral === 'Si' || data.conmocionCerebral === true;
      if (data.cantidadConmociones) updates.cantidad_conmociones = data.cantidadConmociones;
      if (data.fechaUltimaConmocion) updates.fecha_ultima_conmocion = data.fechaUltimaConmocion;
      if (data.afeccionesMentales !== undefined) updates.afecciones_mentales = data.afeccionesMentales === 'Si' || data.afeccionesMentales === true;
      if (data.especificacionAfeccionesMentales) updates.especificacion_afecciones_mentales = data.especificacionAfeccionesMentales;
      if (data.alergiasGraves !== undefined) updates.alergias_graves = data.alergiasGraves === 'Si' || data.alergiasGraves === true;
      if (data.tomaMedicamentos) updates.toma_medicamentos = data.tomaMedicamentos;
      if (data.terminosAceptados !== undefined) updates.terminos_aceptados = data.terminosAceptados === true || data.terminosAceptados === 'true';
      if (data.objecionTratamientoMedico !== undefined) updates.objecion_tratamiento_medico = data.objecionTratamientoMedico === true || data.objecionTratamientoMedico === 'true';
      if (data.objecionTransfusiones !== undefined) updates.objecion_transfusiones = data.objecionTransfusiones === true || data.objecionTransfusiones === 'true';
      if (data.firmaAtleta) updates.firma_atleta = data.firmaAtleta;
      if (data.fechaFirmaAtleta) updates.fecha_firma_atleta = data.fechaFirmaAtleta;
      if (data.firmaTutor) updates.firma_tutor = data.firmaTutor;
      if (data.relacionTutor) updates.relacion_tutor = data.relacionTutor;
      if (data.fechaFirmaTutor) updates.fecha_firma_tutor = data.fechaFirmaTutor;
      if (data.interesInvestigacion) updates.interes_investigacion = data.interesInvestigacion;
      if (data.relacionAtleta) updates.relacion_atleta = data.relacionAtleta;
      if (data.relacionAtletaOtro) updates.relacion_atleta_otro = data.relacionAtletaOtro;

      const [actualizado] = await Atleta.update(updates, { where: { id } });

      if (actualizado || Object.keys(updates).length > 0) {
        const atletaActualizado = await Atleta.findByPk(id);
        return res.status(200).json(successResponse(atletaActualizado, 'Atleta actualizado correctamente'));
      }
      
      res.status(404).json(errorResponse('Atleta no encontrado para actualizar', 404));
    } catch (error) {
      console.error('Error al actualizar atleta:', error);
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json(errorResponse('Error de validación', 400, error.errors.map(e => e.message)));
      }
      if (handleDbError(res, error, 'Error al actualizar el atleta')) return;
      res.status(500).json(errorResponse('Error al actualizar el atleta', 500, error.message));
    }
  },

  /**
   * @function eliminarAtleta
   * @description Borra permanentemente el registro de un atleta de la base de datos por su ID.
   */
  eliminarAtleta: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json(errorResponse('El ID del atleta es requerido.', 400));

      const eliminado = await Atleta.destroy({ where: { id } });

      if (eliminado) {
        return res.status(200).json(successResponse(null, 'Atleta eliminado correctamente'));
      }

      res.status(404).json(errorResponse('Atleta no encontrado', 404));
    } catch (error) {
      res.status(500).json(errorResponse('Error al eliminar el atleta', 500, error.message));
    }
  },
  /**
   * @function obtenerDocumentosAtleta
   * @description Lista todos los documentos o certificaciones asociadas a un atleta específico.
   */
  obtenerDocumentosAtleta: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json(errorResponse('El ID del atleta es requerido.', 400));

      const documentos = await AtletaDocumento.findAll({ where: { atleta_id: id } });
      const safe = documentos.map((d) => documentoService.sanitizePublicAtleta(d));
      res.status(200).json(successResponse(safe, 'Documentos obtenidos correctamente'));
    } catch (error) {
      res.status(500).json(errorResponse('Error al obtener documentos', 500, error.message));
    }
  },

  /**
   * @function agregarDocumento
   * @description Vincula un nuevo documento (ej. certificado médico) a un atleta específico.
   * Espera en el body: { nombre_documento, tipo_documento, ruta_archivo }
   */
  agregarDocumento: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json(errorResponse('El ID del atleta es requerido.', 400));

      if (!req.file) {
        return res.status(400).json(errorResponse('Debe adjuntar un archivo en el campo "archivo".', 400));
      }

      const { nombre_documento, tipo_documento } = req.body;
      const doc = await documentoService.saveAtletaDocument(
        id,
        tipo_documento || 'Otro',
        nombre_documento || req.file.originalname,
        req.file
      );

      res.status(201).json(successResponse(doc, 'Documento agregado exitosamente'));
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json(errorResponse('Error de validación', 400, error.errors.map(e => e.message)));
      }
      res.status(500).json(errorResponse('Error al agregar documento', 500, error.message));
    }
  },

  descargarDocumentoAtleta: async (req, res) => {
    try {
      const { id, docId } = req.params;
      const doc = await documentoService.getAtletaDocumentForDownload(id, docId);
      if (!doc) return res.status(404).json(errorResponse('Documento no encontrado', 404));

      const meta = documentoService.resolveDownloadMeta(doc);
      if (!meta) {
        return res.status(404).json(errorResponse('Archivo cifrado no disponible', 404));
      }

      res.setHeader('Content-Type', meta.mime_type);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(meta.nombre)}"`
      );
      return res.send(meta.buffer);
    } catch (error) {
      res.status(500).json(errorResponse('Error al descargar documento', 500, error.message));
    }
  },

  /**
   * @function eliminarDocumento
   * @description Borra un documento específico asociado a un atleta por su ID y el ID del documento.
   */
  eliminarDocumento: async (req, res) => {
    try {
      const { id, docId } = req.params;
      if (!id || !docId) return res.status(400).json(errorResponse('El ID del atleta y del documento son requeridos.', 400));

      const eliminado = await documentoService.deleteAtletaDocument(id, docId);

      if (eliminado) {
        return res.status(200).json(successResponse(null, 'Documento eliminado correctamente'));
      }
      res.status(404).json(errorResponse('Documento no encontrado', 404));
    } catch (error) {
      res.status(500).json(errorResponse('Error al eliminar el documento', 500, error.message));
    }
  }
};

module.exports = atletaController;
