const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TokenBlacklist = sequelize.define('TokenBlacklist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  motivo: {
    type: DataTypes.STRING(50),
    allowNull: true // ej: logout, expirado
  }
}, {
  tableName: 'token_blacklist',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = TokenBlacklist;
