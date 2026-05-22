const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// [verde] Modelo AtletaDocumento: Gestión de archivos asociados al atleta
const AtletaDocumento = sequelize.define('AtletaDocumento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  atleta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'atletas',
      key: 'id'
    }
  },
  nombre_documento: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del documento es requerido' }
    }
  },
  tipo_documento: {
    type: DataTypes.ENUM('Identificación', 'Certificado Médico', 'Seguro', 'Autorización', 'Otro'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Identificación', 'Certificado Médico', 'Seguro', 'Autorización', 'Otro']],
        msg: 'Tipo de documento no válido'
      }
    }
  },
  ruta_archivo: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La ruta del archivo es obligatoria' }
    }
  },
  nombre_original: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  mime_type: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  storage_key: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  iv: {
    type: DataTypes.STRING(32),
    allowNull: true
  },
  auth_tag: {
    type: DataTypes.STRING(32),
    allowNull: true
  },
  hash_sha256: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  tamano_bytes: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fecha_subida: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'atleta_documentos',
  timestamps: false
});

module.exports = AtletaDocumento;
