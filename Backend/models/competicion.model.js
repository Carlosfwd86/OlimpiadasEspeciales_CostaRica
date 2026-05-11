const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Modelo para gestionar los eventos y torneos deportivos (Competiciones)
const Competicion = sequelize.define('Competicion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  // Relación con la disciplina deportiva del evento
  disciplina_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'disciplinas',
      key: 'id'
    }
  },
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre de la competición es obligatorio' }
    }
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La fecha de inicio es obligatoria' }
    }
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      // Validación personalizada: la fecha de fin debe ser mayor o igual a la de inicio
      esPosterior(value) {
        if (value && this.fecha_inicio && value < this.fecha_inicio) {
          throw new Error('La fecha de fin debe ser posterior o igual a la fecha de inicio');
        }
      }
    }
  },
  ubicacion: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  resumen: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  img_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: { msg: 'La URL de la imagen no es válida' }
    }
  },
  enlace: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: { msg: 'El enlace no es una URL válida' }
    }
  },
  status: {
    type: DataTypes.ENUM('Programado', 'En curso', 'Finalizado'),
    allowNull: false,
    defaultValue: 'Programado'
  }
}, {
  tableName: 'competiciones',
  timestamps: true,
  underscored: true
});

module.exports = Competicion;
