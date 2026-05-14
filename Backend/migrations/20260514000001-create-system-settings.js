'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Crear la tabla
    await queryInterface.createTable('system_settings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      clave: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      valor: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      created_at: {
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

    // 2. Insertar valores por defecto
    await queryInterface.bulkInsert('system_settings', [
      { clave: 'tema',               valor: '"light"', descripcion: 'Tema visual de la interfaz (light | dark)',        created_at: new Date(), updated_at: new Date() },
      { clave: 'idioma',             valor: '"es"',    descripcion: 'Idioma de la aplicación (es | en)',               created_at: new Date(), updated_at: new Date() },
      { clave: 'notificaciones',     valor: 'true',    descripcion: 'Activar/desactivar notificaciones del sistema',   created_at: new Date(), updated_at: new Date() },
      { clave: 'registro_automatico',valor: 'false',   descripcion: 'Registro automático de nuevos atletas activado',  created_at: new Date(), updated_at: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('system_settings');
  }
};
