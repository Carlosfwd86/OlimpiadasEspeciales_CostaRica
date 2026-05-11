const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NivelHabilidad = sequelize.define('NivelHabilidad', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'niveles_habilidad',
    timestamps: false
  });
  return NivelHabilidad;
};
