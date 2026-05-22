'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('registro_pendiente_documentos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      registro_pendiente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'registros_pendientes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      categoria: {
        type: Sequelize.ENUM(
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
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mime_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      storage_key: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      iv: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      auth_tag: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      hash_sha256: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      tamano_bytes: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('registro_pendiente_documentos');
  },
};
