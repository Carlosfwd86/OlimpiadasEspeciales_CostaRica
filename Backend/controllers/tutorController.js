const { models } = require('../config/database');
const { Tutor } = models;
const { successResponse, errorResponse, getPagination, getPagingData } = require('../utils/apiResponse');

/**
 * @module tutorController
 * @description Controlador para gestionar el CRUD de los tutores o encargados de los atletas.
 */

/**
 * @function getAll
 * @description Obtiene el listado completo de todos los tutores registrados.
 */
exports.getAll = async (req, res, next) => {
  try {
    const { limit, offset, page } = getPagination(req.query);
    const { count, rows: tutores } = await Tutor.findAndCountAll({ limit, offset });
    const meta = getPagingData(count, limit, page);
    res.json(successResponse(tutores, 'Tutores obtenidos correctamente', meta));
  } catch (error) { 
    res.status(500).json(errorResponse(error.message));
  }
};

/**
 * @function getById
 * @description Busca y devuelve los datos de un tutor por su ID, manejando formatos compuestos como "tutor_1".
 */
exports.getById = async (req, res, next) => {
  try {
    let { id } = req.params;
    let queryCondition = { id };
      if (typeof id === 'string' && id.includes('_')) {
        queryCondition = { usuario_id: id.split('_')[1] };
      }
    const data = await Tutor.findOne({ where: queryCondition });
    if (!data) return res.status(404).json(errorResponse('Tutor no encontrado', 404));
    res.json(successResponse(data, 'Tutor obtenido correctamente'));
  } catch (error) { 
    res.status(500).json(errorResponse(error.message));
  }
};

/**
 * @function create
 * @description Registra un nuevo tutor, adaptando los nombres (separando nombre y apellido si es necesario) y transformando campos booleanos.
 */
exports.create = async (req, res, next) => {
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

    const datosTutor = {
      usuario_id: req.body.usuario_id || null,
      nombre: primerNombre,
      apellido: apellido,
      cedula: data.cedula || null,
      telefono: data.telefono || null,
      correo_electronico: data.correoElectronico || data.correo_electronico || null,
      direccion: data.direccion || null,
      pais: data.pais || null,
      nombre_atleta: data.nombreAtleta || null,
      relacion_con_atleta: data.relacionConAtleta || null,
      ocupacion: data.ocupacion || null,
      motivacion: data.motivacion || null,
      experiencia_necesidades_especiales: data.experienciaNecesidadesEspeciales === 'Si',
      status: req.body.status || 'ACTIVO'
    };

    const nuevoTutor = await Tutor.create(datosTutor);
    res.status(201).json(successResponse(nuevoTutor, 'Tutor creado exitosamente'));
  } catch (error) { 
    console.error('Error al crear tutor:', error);
    res.status(500).json(errorResponse(error.message));
  }
};

/**
 * @function update
 * @description Actualiza los datos de un tutor, normalizando el formato del payload (camelCase a snake_case).
 */
exports.update = async (req, res, next) => {
  try {
    let { id } = req.params;
    let queryCondition = { id };
      if (typeof id === 'string' && id.includes('_')) {
        queryCondition = { usuario_id: id.split('_')[1] };
      }

    const data = await Tutor.findOne({ where: queryCondition });
    if (!data) return res.status(404).json(errorResponse('Tutor no encontrado', 404));

    const body = req.body;
    const updates = {};
    
    if (body.nombre) {
      let primerNombre = body.nombre;
      let apellido = body.apellido || '';
      if (!apellido && primerNombre.includes(' ')) {
        const partes = primerNombre.trim().split(' ');
        primerNombre = partes[0];
        apellido = partes.slice(1).join(' ');
      }
      updates.nombre = primerNombre;
      if (apellido) updates.apellido = apellido;
    }
    
    if (body.cedula) updates.cedula = body.cedula;
    if (body.telefono) updates.telefono = body.telefono;
    if (body.correoElectronico || body.correo_electronico) updates.correo_electronico = body.correoElectronico || body.correo_electronico;
    if (body.direccion) updates.direccion = body.direccion;
    if (body.pais) updates.pais = body.pais;
    if (body.nombreAtleta || body.nombre_atleta) updates.nombre_atleta = body.nombreAtleta || body.nombre_atleta;
    if (body.relacionConAtleta || body.relacion_con_atleta) updates.relacion_con_atleta = body.relacionConAtleta || body.relacion_con_atleta;
    if (body.ocupacion) updates.ocupacion = body.ocupacion;
    if (body.motivacion) updates.motivacion = body.motivacion;
    if (body.experienciaNecesidadesEspeciales !== undefined) updates.experiencia_necesidades_especiales = body.experienciaNecesidadesEspeciales === 'Si' || body.experienciaNecesidadesEspeciales === true;

    await data.update(updates);
    res.json(successResponse(data, 'Tutor actualizado exitosamente'));
  } catch (error) { 
    res.status(500).json(errorResponse(error.message));
  }
};

/**
 * @function delete
 * @description Elimina permanentemente un tutor de la base de datos por su ID.
 */
exports.delete = async (req, res, next) => {
  try {
    const data = await Tutor.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('Tutor no encontrado', 404));
    await data.destroy();
    res.json(successResponse(null, 'Tutor eliminado'));
  } catch (error) { 
    res.status(500).json(errorResponse(error.message));
  }
};
