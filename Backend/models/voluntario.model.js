const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Modelo para la gestión de Voluntarios participantes
const Voluntario = sequelize.define('Voluntario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  // Relación con la tabla central de usuarios
  usuario_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: true,
    references: { model: 'usuarios', key: 'id' }
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cedula: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  genero: {
    type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  correo_electronico: {
    type: DataTypes.STRING(150),
    allowNull: true,
    validate: { isEmail: true }
  },
  otra_area: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  disponibilidad: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  experiencia_previa: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ACTIVO', 'INACTIVO', 'PENDIENTE'),
    allowNull: false,
    defaultValue: 'PENDIENTE'
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  fecha_aprobacion: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'voluntarios',
  timestamps: true,
  underscored: true
});

module.exports = Voluntario;
