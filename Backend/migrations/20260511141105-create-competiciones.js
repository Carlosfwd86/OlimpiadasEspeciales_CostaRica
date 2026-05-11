'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Creación de la tabla competiciones
    await queryInterface.createTable('competiciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      disciplina_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'disciplinas',
          key: 'id'
        }
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      fecha_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      fecha_fin: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      ubicacion: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      resumen: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      img_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      enlace: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('Programado', 'En curso', 'Finalizado'),
        allowNull: false,
        defaultValue: 'Programado'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Eliminación de la tabla competiciones
    await queryInterface.dropTable('competiciones');
  }
};
