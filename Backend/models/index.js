const { sequelize } = require('../config/database');

// [verde] Importación de modelos del módulo de Atletas
const Atleta = require('./Atleta');
const AtletaDocumento = require('./AtletaDocumento');
const AtletaMedicamento = require('./AtletaMedicamento');
const AtletaCondicion = require('./AtletaCondicion');
const AtletaDispositivo = require('./AtletaDispositivo');
const AtletaAlergia = require('./AtletaAlergia');

// [verde] Importación de modelos del módulo de Seguridad y Autenticación
const Rol = require('./Rol');
const Permiso = require('./Permiso');
const RolPermiso = require('./RolPermiso');
const Usuario = require('./Usuario');
const Sesion = require('./Sesion');
const TokenBlacklist = require('./TokenBlacklist');

// [verde] Definición de asociaciones (Módulo Atletas)
Atleta.hasMany(AtletaDocumento, { foreignKey: 'atleta_id', as: 'documentos' });
AtletaDocumento.belongsTo(Atleta, { foreignKey: 'atleta_id' });

Atleta.hasMany(AtletaMedicamento, { foreignKey: 'atleta_id', as: 'medicamentos' });
AtletaMedicamento.belongsTo(Atleta, { foreignKey: 'atleta_id' });

Atleta.hasMany(AtletaCondicion, { foreignKey: 'atleta_id', as: 'condiciones' });
AtletaCondicion.belongsTo(Atleta, { foreignKey: 'atleta_id' });

Atleta.hasMany(AtletaDispositivo, { foreignKey: 'atleta_id', as: 'dispositivos' });
AtletaDispositivo.belongsTo(Atleta, { foreignKey: 'atleta_id' });

Atleta.hasMany(AtletaAlergia, { foreignKey: 'atleta_id', as: 'alergias' });
AtletaAlergia.belongsTo(Atleta, { foreignKey: 'atleta_id' });

// [verde] Definición de asociaciones (Módulo Seguridad)
Rol.belongsToMany(Permiso, { through: RolPermiso, foreignKey: 'rol_id' });
Permiso.belongsToMany(Rol, { through: RolPermiso, foreignKey: 'permiso_id' });

Rol.hasMany(Usuario, { foreignKey: 'rol_id' });
Usuario.belongsTo(Rol, { foreignKey: 'rol_id' });

Usuario.hasMany(Sesion, { foreignKey: 'usuario_id' });
Sesion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Usuario.hasMany(TokenBlacklist, { foreignKey: 'usuario_id' });
TokenBlacklist.belongsTo(Usuario, { foreignKey: 'usuario_id' });

const db = {
  sequelize,
  Atleta,
  AtletaDocumento,
  AtletaMedicamento,
  AtletaCondicion,
  AtletaDispositivo,
  AtletaAlergia,
  Rol,
  Permiso,
  RolPermiso,
  Usuario,
  Sesion,
  TokenBlacklist
};

module.exports = db;
