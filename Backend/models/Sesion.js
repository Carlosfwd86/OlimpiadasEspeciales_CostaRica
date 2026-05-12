const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sesion = sequelize.define('Sesion', {
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
    },
    onDelete: 'CASCADE'
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
    validate: {
      // Puede ser IPv4 o IPv6
      isIP: true
    }
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  expira_en: {
    type: DataTypes.DATE,
    allowNull: false
  },
  activa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'sesiones',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Sesion;
