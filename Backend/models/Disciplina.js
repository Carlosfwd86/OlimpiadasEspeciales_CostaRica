const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Disciplina = sequelize.define('Disciplina', {
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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    tableName: 'disciplinas',
    timestamps: false
  });
  return Disciplina;
};
