const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RegistroPendienteDocumento = sequelize.define(
    'RegistroPendienteDocumento',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      registro_pendiente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoria: {
        type: DataTypes.ENUM(
          'cedula',
          'certificado_medico',
          'foto',
          'id_tutor',
          'antecedentes',
          'titulo',
          'otro'
        ),
        allowNull: false,
      },
      nombre_original: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      mime_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      storage_key: {
        type: DataTypes.STRING(500),
        allowNull: true,  // null cuando se usa url_documento
        defaultValue: null,
      },
      iv: {
        type: DataTypes.STRING(32),
        allowNull: true,
        defaultValue: null,
      },
      auth_tag: {
        type: DataTypes.STRING(32),
        allowNull: true,
        defaultValue: null,
      },
      hash_sha256: {
        type: DataTypes.STRING(64),
        allowNull: true,
        defaultValue: null,
      },
      tamano_bytes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url_documento: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        defaultValue: null,
        comment: 'URL pública del documento (S3 o almacenamiento local público)',
      },
      estado_ia: {
        type: DataTypes.ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO', 'NO_APLICA'),
        defaultValue: 'PENDIENTE',
        allowNull: false,
      },
      analisis_ia: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'Retroalimentación automática generada por OpenAI (gpt-4o)',
      },
    },
    {
      tableName: 'registro_pendiente_documentos',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return RegistroPendienteDocumento;
};
