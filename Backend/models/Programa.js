const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Programa = sequelize.define('Programa', {
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
    provincia: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    activa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    tableName: 'programas',
    timestamps: false
  });
  return Programa;
};
