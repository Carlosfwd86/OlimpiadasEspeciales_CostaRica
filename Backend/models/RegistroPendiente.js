const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RegistroPendiente = sequelize.define('RegistroPendiente', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rol: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    correo_electronico: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    datos: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Guarda todo el payload del formulario (Atleta, Voluntario, etc.)'
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA'),
      defaultValue: 'PENDIENTE',
      allowNull: false
    }
  }, {
    tableName: 'registros_pendientes',
    timestamps: true,
    createdAt: 'fecha_registro',
    updatedAt: 'updated_at'
  });
  return RegistroPendiente;
};
