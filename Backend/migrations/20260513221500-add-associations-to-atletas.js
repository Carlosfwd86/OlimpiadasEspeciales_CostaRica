'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('atletas');
    
    if (!tableInfo.programa_id) {
      await queryInterface.addColumn('atletas', 'programa_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'programas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }

    if (!tableInfo.nivel_habilidad_id) {
      await queryInterface.addColumn('atletas', 'nivel_habilidad_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'niveles_habilidad',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('atletas', 'programa_id');
    await queryInterface.removeColumn('atletas', 'nivel_habilidad_id');
  }
};
