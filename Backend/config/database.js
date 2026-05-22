require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Configuración de la conexión
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  }
);

// Exportar sequelize ANTES de requerir los modelos para evitar dependencia circular
module.exports.sequelize = sequelize;


// Importación Manual de Modelos (Evitando index.js)
const models = {
  Usuario: require('../models/Usuario'),
  Rol: require('../models/Rol'),
  Atleta: require('../models/Atleta'),
  Programa: require('../models/Programa')(sequelize),
  Disciplina: require('../models/Disciplina')(sequelize),
  NivelHabilidad: require('../models/NivelHabilidad')(sequelize),
  Inscripcion: require('../models/Inscripcion')(sequelize),
  Consulta: require('../models/Consulta')(sequelize),
  Sesion: require('../models/Sesion'),
  TokenBlacklist: require('../models/TokenBlacklist'),
  Tutor: require('../models/Tutor')(sequelize),
  Competicion: require('../models/competicion.model'),
  Entrenador: require('../models/entrenador.model'),
  Voluntario: require('../models/voluntario.model'),
  SystemSetting: require('../models/SystemSetting'),
  ActividadSistema: require('../models/ActividadSistema'),
  RegistroPendiente: require('../models/RegistroPendiente')(sequelize),
  RegistroPendienteDocumento: require('../models/RegistroPendienteDocumento')(sequelize),
  AtletaAlergia: require('../models/AtletaAlergia'),
  AtletaCondicion: require('../models/AtletaCondicion'),
  AtletaDispositivo: require('../models/AtletaDispositivo'),
  AtletaDocumento: require('../models/AtletaDocumento'),
  AtletaMedicamento: require('../models/AtletaMedicamento'),
  VoluntarioArea: require('../models/voluntario_area.model')
};

// Definición de Asociaciones
const { 
  Usuario, Rol, Atleta, Programa, Inscripcion, 
  Competicion, Sesion, Entrenador, Voluntario, VoluntarioArea,
  AtletaAlergia, AtletaCondicion, AtletaDispositivo, AtletaDocumento, AtletaMedicamento 
} = models;

if (Usuario && Rol) {
  Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });
  Rol.hasMany(Usuario, { foreignKey: 'rol_id' });
}



if (Atleta && Programa) {
  Atleta.belongsTo(Programa, { foreignKey: 'programa_id', as: 'programa' });
  Programa.hasMany(Atleta, { foreignKey: 'programa_id' });
}

// Asociaciones de Atleta con Salud y Documentos
if (Atleta) {
  if (AtletaAlergia) {
    Atleta.hasMany(AtletaAlergia, { foreignKey: 'atleta_id', as: 'alergias' });
    AtletaAlergia.belongsTo(Atleta, { foreignKey: 'atleta_id' });
  }
  if (AtletaCondicion) {
    Atleta.hasMany(AtletaCondicion, { foreignKey: 'atleta_id', as: 'condiciones' });
    AtletaCondicion.belongsTo(Atleta, { foreignKey: 'atleta_id' });
  }
  if (AtletaDispositivo) {
    Atleta.hasMany(AtletaDispositivo, { foreignKey: 'atleta_id', as: 'dispositivos' });
    AtletaDispositivo.belongsTo(Atleta, { foreignKey: 'atleta_id' });
  }
  if (AtletaDocumento) {
    Atleta.hasMany(AtletaDocumento, { foreignKey: 'atleta_id', as: 'documentos' });
    AtletaDocumento.belongsTo(Atleta, { foreignKey: 'atleta_id' });
  }
  if (AtletaMedicamento) {
    Atleta.hasMany(AtletaMedicamento, { foreignKey: 'atleta_id', as: 'medicamentos' });
    AtletaMedicamento.belongsTo(Atleta, { foreignKey: 'atleta_id' });
  }
}

// Asociaciones de Voluntario
if (Voluntario && VoluntarioArea) {
  Voluntario.hasMany(VoluntarioArea, { foreignKey: 'voluntario_id' });
  VoluntarioArea.belongsTo(Voluntario, { foreignKey: 'voluntario_id' });
}

if (Inscripcion && Atleta && Competicion) {
  Inscripcion.belongsTo(Atleta, { foreignKey: 'atleta_id', as: 'atleta' });
  Inscripcion.belongsTo(Competicion, { foreignKey: 'competicion_id', as: 'competicion' });
}

if (Sesion && Usuario) {
  Sesion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
}

if (Atleta && models.NivelHabilidad) {
  Atleta.belongsTo(models.NivelHabilidad, { foreignKey: 'nivel_habilidad_id', as: 'nivel_habilidad' });
  models.NivelHabilidad.hasMany(Atleta, { foreignKey: 'nivel_habilidad_id' });
}

const { RegistroPendiente, RegistroPendienteDocumento } = models;
if (RegistroPendiente && RegistroPendienteDocumento) {
  RegistroPendiente.hasMany(RegistroPendienteDocumento, {
    foreignKey: 'registro_pendiente_id',
    as: 'documentos',
  });
  RegistroPendienteDocumento.belongsTo(RegistroPendiente, {
    foreignKey: 'registro_pendiente_id',
  });
}

module.exports.models = models;
