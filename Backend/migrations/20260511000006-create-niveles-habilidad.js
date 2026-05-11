'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('niveles_habilidad', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nombre: { type: Sequelize.STRING(50), unique: true, allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: true }
    });

    await queryInterface.sequelize.query(`ALTER TABLE niveles_habilidad ADD CONSTRAINT chk_niveles_nombre CHECK (CHAR_LENGTH(nombre) >= 2)`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('niveles_habilidad');
  }
};
