'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      rol_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
      correo_electronico: {
        type: Sequelize.STRING(150),
        unique: true,
        allowNull: false
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      telefono: {
        type: Sequelize.STRING(15),
        allowNull: true
      },
      direccion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      pais: {
        type: Sequelize.STRING(50),
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
      avatar_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO'),
        allowNull: false,
        defaultValue: 'ACTIVO'
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('usuarios');
  }
};
