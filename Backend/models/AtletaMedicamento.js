const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// [verde] Modelo AtletaMedicamento: Registro de medicamentos del atleta
const AtletaMedicamento = sequelize.define('AtletaMedicamento', {
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
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del medicamento es requerido' }
    }
  },
  dosis: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La dosis es obligatoria' }
    }
  },
  frecuencia: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La frecuencia es obligatoria' }
    }
  }
}, {
  tableName: 'atleta_medicamentos',
  timestamps: false
});

module.exports = AtletaMedicamento;
