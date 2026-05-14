const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo SystemSetting
 * Almacena preferencias del sistema como pares clave→valor en la BD.
 * Tabla: system_settings
 */
const SystemSetting = sequelize.define('SystemSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  clave: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'Identificador único de la preferencia (ej: tema, idioma)'
  },
  valor: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Valor serializado como string. Booleanos y números se convierten con JSON.parse/stringify.'
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Descripción legible de la preferencia'
  }
}, {
  tableName: 'system_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = SystemSetting;
