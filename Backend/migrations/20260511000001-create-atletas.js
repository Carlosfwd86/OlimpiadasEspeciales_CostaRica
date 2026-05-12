'use strict';

// [verde] Migración para crear la tabla 'atletas'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('atletas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      primer_apellido: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      segundo_apellido: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      fecha_nacimiento: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      genero: {
        type: Sequelize.ENUM('Masculino', 'Femenino', 'Otro'),
        allowNull: false
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      correo_electronico: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      fecha_registro: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('atletas');
  }
};
