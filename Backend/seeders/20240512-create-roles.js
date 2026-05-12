'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [
      {
        nombre: 'Administrador',
        descripcion: 'Acceso total al sistema y gestión de usuarios.',
        created_at: new Date()
      },
      {
        nombre: 'Atleta',
        descripcion: 'Participante en las disciplinas y competencias.',
        created_at: new Date()
      },
      {
        nombre: 'Entrenador',
        descripcion: 'Encargado de la formación y seguimiento de atletas.',
        created_at: new Date()
      },
      {
        nombre: 'Tutor',
        descripcion: 'Responsable legal o familiar de un atleta.',
        created_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  }
};
