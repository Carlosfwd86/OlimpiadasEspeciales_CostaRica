'use strict';

// [verde] Migración para crear la tabla 'atleta_medicamentos'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('atleta_medicamentos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      atleta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'atletas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      dosis: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      frecuencia: {
        type: Sequelize.STRING(100),
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('atleta_medicamentos');
  }
};
