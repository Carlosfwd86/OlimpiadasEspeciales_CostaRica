const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo ActividadSistema
 * Almacena el log de actividad del sistema de forma persistente.
 * Tabla: actividad_sistema
 */
const ActividadSistema = sequelize.define('ActividadSistema', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'fa-solid fa-circle-info'
  },
  icon_color: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'blue'
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'actividad_sistema',
  timestamps: false  // Usamos `time` como campo de fecha explícito
});

module.exports = ActividadSistema;
