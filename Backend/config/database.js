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
  Permiso: require('../models/Permiso'),
  RolPermiso: require('../models/RolPermiso'),
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
  ActividadSistema: require('../models/ActividadSistema')
};

// Definición de Asociaciones
const { Usuario, Rol, Permiso, RolPermiso, Atleta, Programa, Inscripcion, Competicion, Sesion, Entrenador } = models;

if (Usuario && Rol) {
  Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });
  Rol.hasMany(Usuario, { foreignKey: 'rol_id' });
}

if (Rol && Permiso && RolPermiso) {
  Rol.belongsToMany(Permiso, { through: RolPermiso, foreignKey: 'rol_id', as: 'permisos' });
  Permiso.belongsToMany(Rol, { through: RolPermiso, foreignKey: 'permiso_id', as: 'roles' });
}

if (Atleta && Programa) {
  Atleta.belongsTo(Programa, { foreignKey: 'programa_id', as: 'programa' });
  Programa.hasMany(Atleta, { foreignKey: 'programa_id' });
}

if (Inscripcion && Atleta && Competicion) {
  Inscripcion.belongsTo(Atleta, { foreignKey: 'atleta_id', as: 'atleta' });
  Inscripcion.belongsTo(Competicion, { foreignKey: 'competicion_id', as: 'competicion' });
}

if (Sesion && Usuario) {
  Sesion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
}

module.exports.models = models;
