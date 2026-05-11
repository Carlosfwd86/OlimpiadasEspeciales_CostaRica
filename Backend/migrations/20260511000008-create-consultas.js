'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('consultas', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      usuario_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'usuarios', key: 'id' } },
      nombre: { type: Sequelize.STRING(100), allowNull: false },
      correo: { type: Sequelize.STRING(150), allowNull: false },
      asunto: { type: Sequelize.STRING(100), allowNull: false },
      mensaje: { type: Sequelize.TEXT, allowNull: false },
      leida: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
      fecha: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('consultas');
  }
};
