'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('disciplinas', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nombre: { type: Sequelize.STRING(100), unique: true, allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      activa: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false }
    });

    await queryInterface.sequelize.query(`ALTER TABLE disciplinas ADD CONSTRAINT chk_disciplinas_nombre CHECK (CHAR_LENGTH(nombre) >= 2)`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('disciplinas');
  }
};
