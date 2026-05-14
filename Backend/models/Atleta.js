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
}, {
  tableName: 'atletas',
  timestamps: false // Según SQL usa fecha_registro explícito
});

module.exports = Atleta;
