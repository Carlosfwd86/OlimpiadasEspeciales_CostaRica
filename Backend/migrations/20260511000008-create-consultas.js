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

    await queryInterface.sequelize.query(`ALTER TABLE consultas ADD CONSTRAINT chk_consultas_correo CHECK (correo REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}$')`);
    await queryInterface.sequelize.query(`ALTER TABLE consultas ADD CONSTRAINT chk_consultas_mensaje CHECK (CHAR_LENGTH(mensaje) >= 10)`);
    await queryInterface.sequelize.query(`ALTER TABLE consultas ADD CONSTRAINT chk_consultas_nombre CHECK (CHAR_LENGTH(nombre) >= 2)`);
    await queryInterface.sequelize.query(`ALTER TABLE consultas ADD CONSTRAINT chk_consultas_asunto CHECK (CHAR_LENGTH(asunto) >= 3)`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('consultas');
  }
};
