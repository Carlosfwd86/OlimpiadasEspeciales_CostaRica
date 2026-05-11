'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('programas', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nombre: { type: Sequelize.STRING(100), unique: true, allowNull: false },
      provincia: { type: Sequelize.STRING(100), allowNull: true },
      activa: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('programas');
  }
};
