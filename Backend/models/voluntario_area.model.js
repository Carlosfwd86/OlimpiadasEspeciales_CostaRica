const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Modelo auxiliar para gestionar las múltiples áreas de interés de un voluntario
const VoluntarioArea = sequelize.define('VoluntarioArea', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  // Relación con el voluntario propietario de las áreas
  voluntario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'voluntarios',
      key: 'id'
    }
  },
  area: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre de la área es obligatorio' }
    }
  }
}, {
  tableName: 'voluntario_areas',
  timestamps: false, // Esta tabla no requiere timestamps según el SQL
  underscored: true
});

module.exports = VoluntarioArea;
