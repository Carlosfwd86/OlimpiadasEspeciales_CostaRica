'use strict';

/**
 * Migración: Agrega url_documento a registro_pendiente_documentos
 * y hace los campos de encriptación opcionales para permitir
 * el nuevo flujo de almacenamiento en la nube (S3 / local público).
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Agregar columna url_documento (nullable)
    await queryInterface.addColumn('registro_pendiente_documentos', 'url_documento', {
      type: Sequelize.STRING(1000),
      allowNull: true,
      defaultValue: null,
      comment: 'URL pública del documento (S3 o almacenamiento local público)',
      after: 'storage_key',
    });

    // 2. Hacer los campos crypto opcionales (para registros que usan URL)
    await queryInterface.changeColumn('registro_pendiente_documentos', 'storage_key', {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.changeColumn('registro_pendiente_documentos', 'iv', {
      type: Sequelize.STRING(32),
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.changeColumn('registro_pendiente_documentos', 'auth_tag', {
      type: Sequelize.STRING(32),
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.changeColumn('registro_pendiente_documentos', 'hash_sha256', {
      type: Sequelize.STRING(64),
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('registro_pendiente_documentos', 'url_documento');

    // Revertir a NOT NULL (cuidado: fallará si hay datos NULL)
    await queryInterface.changeColumn('registro_pendiente_documentos', 'storage_key', {
      type: Sequelize.STRING(500),
      allowNull: false,
    });
    await queryInterface.changeColumn('registro_pendiente_documentos', 'iv', {
      type: Sequelize.STRING(32),
      allowNull: false,
    });
    await queryInterface.changeColumn('registro_pendiente_documentos', 'auth_tag', {
      type: Sequelize.STRING(32),
      allowNull: false,
    });
    await queryInterface.changeColumn('registro_pendiente_documentos', 'hash_sha256', {
      type: Sequelize.STRING(64),
      allowNull: false,
    });
  },
};
