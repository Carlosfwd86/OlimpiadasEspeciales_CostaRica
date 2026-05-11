'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inscripciones', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      atleta_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'atletas', key: 'id' } },
      disciplina_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'disciplinas', key: 'id' } },
      programa_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'programas', key: 'id' } },
      nivel_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'niveles_habilidad', key: 'id' } },
      estado: { type: Sequelize.ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA'), defaultValue: 'PENDIENTE', allowNull: false },
      notas: { type: Sequelize.TEXT, allowNull: true },
      fecha_inscripcion: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      fecha_aprobacion: { type: Sequelize.DATE, allowNull: true },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inscripciones');
  }
};
