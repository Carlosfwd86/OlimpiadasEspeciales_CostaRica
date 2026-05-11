'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('permisos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false
      },
      ruta: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      metodo: {
        type: Sequelize.ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE'),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('permisos');
  }
};
