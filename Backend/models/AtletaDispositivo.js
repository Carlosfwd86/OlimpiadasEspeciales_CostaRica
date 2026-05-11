const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// [verde] Modelo AtletaDispositivo: Registro de dispositivos (médicos, comunicación, etc)
const AtletaDispositivo = sequelize.define('AtletaDispositivo', {
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
  tipo: {
    type: DataTypes.ENUM('movilidad', 'medico', 'vida', 'comunicacion'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['movilidad', 'medico', 'vida', 'comunicacion']],
        msg: 'Tipo de dispositivo no válido'
      }
    }
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del dispositivo es requerido' }
    }
  }
}, {
  tableName: 'atleta_dispositivos',
  timestamps: false
});

module.exports = AtletaDispositivo;
