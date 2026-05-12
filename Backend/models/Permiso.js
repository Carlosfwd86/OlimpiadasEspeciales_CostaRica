const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Permiso = sequelize.define('Permiso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  ruta: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      // Verifica que inicie con /api/v1/
      is: /^\/api\/v1\/.*/i
    }
  },
  metodo: {
    type: DataTypes.ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE'),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'permisos',
  timestamps: false // El esquema no especifica created_at ni updated_at
});

module.exports = Permiso;
