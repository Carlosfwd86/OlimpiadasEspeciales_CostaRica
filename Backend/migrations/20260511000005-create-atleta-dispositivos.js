'use strict';

// [verde] Migración para crear la tabla 'atleta_dispositivos'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('atleta_dispositivos', {
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
      tipo: {
        type: Sequelize.ENUM('movilidad', 'medico', 'vida', 'comunicacion'),
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('atleta_dispositivos');
  }
};
