const { sequelize } = require('../config/database');

// Importar los modelos
const Rol = require('./Rol');
const Permiso = require('./Permiso');
const RolPermiso = require('./RolPermiso');
const Usuario = require('./Usuario');
const Sesion = require('./Sesion');
const TokenBlacklist = require('./TokenBlacklist');

// Definir las asociaciones

// Relación Rol - Permiso (N:M) a través de RolPermiso
Rol.belongsToMany(Permiso, { through: RolPermiso, foreignKey: 'rol_id' });
Permiso.belongsToMany(Rol, { through: RolPermiso, foreignKey: 'permiso_id' });

// Relación Rol - Usuario (1:N)
Rol.hasMany(Usuario, { foreignKey: 'rol_id' });
Usuario.belongsTo(Rol, { foreignKey: 'rol_id' });

// Relación Usuario - Sesion (1:N)
Usuario.hasMany(Sesion, { foreignKey: 'usuario_id' });
Sesion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Relación Usuario - TokenBlacklist (1:N)
Usuario.hasMany(TokenBlacklist, { foreignKey: 'usuario_id' });
TokenBlacklist.belongsTo(Usuario, { foreignKey: 'usuario_id' });

const db = {
  sequelize,
  Rol,
  Permiso,
  RolPermiso,
  Usuario,
  Sesion,
  TokenBlacklist
};

module.exports = db;
