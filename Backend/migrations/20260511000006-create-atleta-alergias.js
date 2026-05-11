'use strict';

// [verde] Migración para crear la tabla 'atleta_alergias'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('atleta_alergias', {
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
      tipo_alergia: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      especificacion: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('atleta_alergias');
  }
};
