const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Consulta = sequelize.define('Consulta', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    asunto: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 10000] // mínimo 10 caracteres
      }
    },
    leida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    tableName: 'consultas',
    timestamps: true,
    createdAt: 'fecha',
    updatedAt: false
  });
  return Consulta;
};
