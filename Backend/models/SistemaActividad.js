const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SistemaActividad = sequelize.define('SistemaActividad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(50),
    defaultValue: 'fa-solid fa-circle-info'
  },
  iconColor: {
    type: DataTypes.STRING(20),
    defaultValue: 'blue'
  },
  time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'sistema_actividad',
  timestamps: false
});

module.exports = SistemaActividad;
