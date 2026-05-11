'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Creación de la tabla voluntarios
    await queryInterface.createTable('voluntarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: true,
        references: { model: 'usuarios', key: 'id' }
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      apellido: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      cedula: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: true
      },
      fecha_nacimiento: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      genero: {
        type: Sequelize.ENUM('Masculino', 'Femenino', 'Otro'),
        allowNull: true
      },
      telefono: {
        type: Sequelize.STRING(15),
        allowNull: true
      },
      correo_electronico: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      otra_area: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      disponibilidad: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      experiencia_previa: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('ACTIVO', 'INACTIVO', 'PENDIENTE'),
        allowNull: false,
        defaultValue: 'PENDIENTE'
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      fecha_aprobacion: {
        type: Sequelize.DATE,
        allowNull: true
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
    // Eliminación de la tabla voluntarios
    await queryInterface.dropTable('voluntarios');
  }
};
