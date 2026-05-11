const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Tabla pivote para gestionar la relación N:M entre Atletas y Competiciones
const CompeticionAtleta = sequelize.define('CompeticionAtleta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  // Referencia a la competición
  competicion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'competiciones',
      key: 'id'
    }
  },
  // Referencia al atleta participante
  atleta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'atletas',
      key: 'id'
    }
  },
  resultado: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  posicion: {
    type: DataTypes.SMALLINT.UNSIGNED,
    allowNull: true,
    validate: {
      min: {
        args: [1],
        msg: 'La posición debe ser mayor a 0'
      }
    }
  }
}, {
  tableName: 'competicion_atletas',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false // Esta tabla solo requiere created_at según el SQL original
});

module.exports = CompeticionAtleta;
