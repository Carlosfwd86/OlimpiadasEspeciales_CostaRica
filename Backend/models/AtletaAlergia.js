const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// [verde] Modelo AtletaAlergia: Registro de alergias del atleta
const AtletaAlergia = sequelize.define('AtletaAlergia', {
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
  tipo_alergia: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El tipo de alergia es requerido' }
    }
  },
  especificacion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'atleta_alergias',
  timestamps: false
});

module.exports = AtletaAlergia;
