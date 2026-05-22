'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('atleta_documentos', 'nombre_original', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('atleta_documentos', 'mime_type', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('atleta_documentos', 'storage_key', {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
    await queryInterface.addColumn('atleta_documentos', 'iv', {
      type: Sequelize.STRING(32),
      allowNull: true,
    });
    await queryInterface.addColumn('atleta_documentos', 'auth_tag', {
      type: Sequelize.STRING(32),
      allowNull: true,
    });
    await queryInterface.addColumn('atleta_documentos', 'hash_sha256', {
      type: Sequelize.STRING(64),
      allowNull: true,
    });
    await queryInterface.addColumn('atleta_documentos', 'tamano_bytes', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    const cols = [
      'nombre_original',
      'mime_type',
      'storage_key',
      'iv',
      'auth_tag',
      'hash_sha256',
      'tamano_bytes',
    ];
    for (const col of cols) {
      await queryInterface.removeColumn('atleta_documentos', col);
    }
  },
};
