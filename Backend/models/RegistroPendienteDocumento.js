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
        allowNull: false,
      },
      iv: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      auth_tag: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      hash_sha256: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      tamano_bytes: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
