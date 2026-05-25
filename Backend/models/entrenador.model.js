const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Modelo para la gestión de Entrenadores del sistema
const Entrenador = sequelize.define('Entrenador', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  // Relación 1:1 con usuarios
  usuario_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: true,
    references: { model: 'usuarios', key: 'id' }
  },
  // Relación con el catálogo de disciplinas
  disciplina_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'disciplinas', key: 'id' }
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
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isBefore: {
        args: new Date().toISOString().split('T')[0],
        msg: 'La fecha de nacimiento no puede ser futura'
      }
    }
  },
  genero: {
    type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  correo_electronico: {
    type: DataTypes.STRING(150),
    allowNull: true,
    validate: { isEmail: true }
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pais: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  emergencia_nombre: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  emergencia_telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  anios_experiencia: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: true,
    validate: { min: 0, max: 99 }
  },
  certificaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  horario_disponible: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  afeccion_salud: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  detalle_salud: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  otros_dispositivos: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  especificacion_otros_dispositivos: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  terminos_aceptados: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  firma_entrenador: { type: DataTypes.STRING(255), allowNull: true },
  fecha_firma_entrenador: { type: DataTypes.DATEONLY, allowNull: true },
  equipo: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  proximos_retos: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ACTIVO', 'INACTIVO', 'PENDIENTE'),
    allowNull: false,
    defaultValue: 'PENDIENTE'
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  fecha_aprobacion: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'entrenadores',
  timestamps: true,
  underscored: true
});

module.exports = Entrenador;
