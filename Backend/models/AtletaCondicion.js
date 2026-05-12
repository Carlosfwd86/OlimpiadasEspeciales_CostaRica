const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// [verde] Modelo AtletaCondicion: Registro de condiciones médicas del atleta
const AtletaCondicion = sequelize.define('AtletaCondicion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  atleta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'atletas',
      key: 'id'
    }
  },
  condicion: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La condición médica es requerida' }
    }
  }
}, {
  tableName: 'atleta_condiciones',
  timestamps: false
});

module.exports = AtletaCondicion;
