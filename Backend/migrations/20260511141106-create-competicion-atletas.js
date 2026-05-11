'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Creación de la tabla competicion_atletas (Pivote N:M)
    await queryInterface.createTable('competicion_atletas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      competicion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'competiciones',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      atleta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'atletas',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      resultado: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      posicion: {
        type: Sequelize.SMALLINT.UNSIGNED,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Eliminación de la tabla competicion_atletas
    await queryInterface.dropTable('competicion_atletas');
  }
};
