const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tutor = sequelize.define('Tutor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      unique: true,
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
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cedula: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    correo_electronico: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pais: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    relacion_con_atleta: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    experiencia_necesidades_especiales: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
      defaultValue: 'ACTIVO',
      allowNull: false
    }
  }, {
    tableName: 'tutores',
    timestamps: true,
    createdAt: 'fecha_registro',
    updatedAt: 'updated_at'
  });
  return Tutor;
};
