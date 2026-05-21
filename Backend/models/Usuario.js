const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      // Mínimo 2 caracteres
      len: [2, 100]
    }
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cedula: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true,
    validate: {
      // isNumeric: true // Removido para soportar guiones
    }
  },
  correo_electronico: {
    type: DataTypes.STRING(150),
    unique: true,
    allowNull: false,
    validate: {
      // Formato email
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: true,
    validate: {
      // Solo dígitos y longitud mínima de 7 (relajado para permitir formatos con +, -, etc)
      // len: [7, 20] 
      // Se quita isNumeric para permitir +506 8888-8888
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
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      // Validar que no sea futura
      isBefore: new Date().toISOString().split('T')[0]
    }
  },
  genero: {
    type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'),
    allowNull: true
  },
  avatar_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
/*
  equipo: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  experiencia: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  proximos_retos: {
    type: DataTypes.TEXT,
    allowNull: true
  },
*/
  reset_password_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  reset_password_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO'),
    allowNull: false,
    defaultValue: 'ACTIVO'
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'fecha_registro',
  updatedAt: 'updated_at'
});

module.exports = Usuario;
