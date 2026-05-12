'use strict';

// [verde] Migración para crear la tabla 'atleta_documentos'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('atleta_documentos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      atleta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'atletas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nombre_documento: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      tipo_documento: {
        type: Sequelize.ENUM('Identificación', 'Certificado Médico', 'Seguro', 'Autorización', 'Otro'),
        allowNull: false
      },
      ruta_archivo: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      fecha_subida: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('atleta_documentos');
  }
};
