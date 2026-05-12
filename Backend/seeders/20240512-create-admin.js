'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('usuarios', [
      {
        rol_id: 1, // Administrador
        nombre: 'Admin',
        apellido: 'Principal',
        cedula: '000000000',
        correo_electronico: 'admin@olimpiadas.cr',
        password_hash: '$2b$10$uCA06b0RG5H6sLV46GaZzO6Gcr98xbNT90gy36Bf3LbSnIyztwdmO',
        status: 'ACTIVO',
        fecha_registro: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('usuarios', { correo_electronico: 'admin@olimpiadas.cr' }, {});
  }
};
