'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // [verde] Inserta todos los roles base del sistema
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      { id: 1, nombre: 'admin',      descripcion: 'Administrador del sistema', created_at: new Date() },
      { id: 2, nombre: 'atleta',     descripcion: 'Atleta registrado',          created_at: new Date() },
      { id: 3, nombre: 'entrenador', descripcion: 'Entrenador deportivo',        created_at: new Date() },
      { id: 4, nombre: 'voluntario', descripcion: 'Voluntario del programa',     created_at: new Date() },
      { id: 5, nombre: 'tutor',      descripcion: 'Tutor legal del atleta',      created_at: new Date() },
      { id: 6, nombre: 'usuario',    descripcion: 'Usuario general del sistema', created_at: new Date() },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
