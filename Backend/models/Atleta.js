const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// [verde] Modelo Atleta: Representa la información básica del atleta
const Atleta = sequelize.define('Atleta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre no puede estar vacío' }
    }
  },
  primer_apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El primer apellido no puede estar vacío' }
    }
  },
  segundo_apellido: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: 'Debe ser una fecha válida' },
      isBefore: {
        args: new Date().toISOString().split('T')[0],
        msg: 'La fecha de nacimiento debe ser en el pasado'
      }
    }
  },
  genero: {
    type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Masculino', 'Femenino', 'Otro']],
        msg: 'Género no válido'
      }
    }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      len: {
        args: [0, 20],
        msg: 'El teléfono no puede exceder los 20 caracteres'
      }
    }
  },
  correo_electronico: {
    type: DataTypes.STRING(150),
    allowNull: true,
    validate: {
      isEmail: { msg: 'Debe ser un correo electrónico válido' }
    }
  },
  cedula: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  pais: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  direccion: {
    type: DataTypes.TEXT,
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
  tutor_nombre: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tutor_apellido: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tutor_relacion: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tutor_telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  tutor_correo: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  tutor_pais: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tutor_cedula: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
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
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  programa_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'programas',
      key: 'id'
    }
  },
  nivel_habilidad_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'niveles_habilidad',
      key: 'id'
    }
  }
  ,
  disciplina_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'disciplinas', key: 'id' }
  },
  req_dietetico: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  especificacion_dietetico: {
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
  afeccion_cardiaca: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  asma: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  diabetes: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  disc_visual: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  disc_auditiva: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  trastorno_hemorragico: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  medico_limito_deportes: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  epilepsia_convulsivo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  anemia_depranocitica: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  conmocion_cerebral: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  cantidad_conmociones: { type: DataTypes.INTEGER, allowNull: true },
  fecha_ultima_conmocion: { type: DataTypes.DATEONLY, allowNull: true },
  afecciones_mentales: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  especificacion_afecciones_mentales: { type: DataTypes.TEXT, allowNull: true },
  alergias_graves: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  toma_medicamentos: { type: DataTypes.STRING(100), allowNull: true },
  terminos_aceptados: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  objecion_tratamiento_medico: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  objecion_transfusiones: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  firma_atleta: { type: DataTypes.STRING(255), allowNull: true },
  fecha_firma_atleta: { type: DataTypes.DATEONLY, allowNull: true },
  firma_tutor: { type: DataTypes.STRING(255), allowNull: true },
  relacion_tutor: { type: DataTypes.STRING(100), allowNull: true },
  fecha_firma_tutor: { type: DataTypes.DATEONLY, allowNull: true },
  interes_investigacion: { type: DataTypes.STRING(100), allowNull: true },
  relacion_atleta: { type: DataTypes.STRING(100), allowNull: true },
  relacion_atleta_otro: { type: DataTypes.STRING(255), allowNull: true }
}, {
  tableName: 'atletas',
  timestamps: false // Según SQL usa fecha_registro explícito
});

module.exports = Atleta;
