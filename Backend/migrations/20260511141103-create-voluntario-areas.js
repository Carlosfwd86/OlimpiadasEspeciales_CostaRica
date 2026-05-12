'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Creación de la tabla voluntario_areas
    await queryInterface.createTable('voluntario_areas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      voluntario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'voluntarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      area: {
        type: Sequelize.STRING(100),
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Eliminación de la tabla voluntario_areas
    await queryInterface.dropTable('voluntario_areas');
  }
};
