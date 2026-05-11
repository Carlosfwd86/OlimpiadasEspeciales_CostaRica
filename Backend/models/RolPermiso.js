const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RolPermiso = sequelize.define('RolPermiso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  permiso_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'permisos',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'rol_permisos',
  timestamps: false
});

module.exports = RolPermiso;
