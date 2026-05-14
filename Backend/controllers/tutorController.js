const { models } = require('../config/database');
const { Tutor } = models;

exports.getAll = async (req, res, next) => {
  try {
    const data = await Tutor.findAll();
    res.json(data);
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (typeof id === 'string' && id.includes('_')) {
      id = id.split('_')[1];
    }
    const data = await Tutor.findByPk(id);
    if (!data) return res.status(404).json({ message: 'Tutor no encontrado' });
    res.json(data);
  } catch (error) { next(error); }
};

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
    res.status(201).json(nuevoTutor);
  } catch (error) { 
    console.error('Error al crear tutor:', error);
    next(error); 
  }
};

exports.update = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (typeof id === 'string' && id.includes('_')) {
      id = id.split('_')[1];
    }

    const data = await Tutor.findByPk(id);
    if (!data) return res.status(404).json({ message: 'Tutor no encontrado' });

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
    res.json(data);
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    const data = await Tutor.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Tutor no encontrado' });
    await data.destroy();
    res.json({ message: 'Tutor eliminado' });
  } catch (error) { next(error); }
};
