'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // [verde] tutores: id, usuario_id, nombre, apellido, cedula, telefono,
  //                  correo_electronico, direccion, pais, relacion_con_atleta,
  //                  experiencia_necesidades_especiales, status, fecha_registro, updated_at
  // [verde] NOTA: No tiene columna 'nombre_atleta' — no está en la migración
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tutores', [
      {
        id: 1,
        usuario_id: null,
        nombre: 'andres',
        apellido: 'N/A',
        cedula: '23456789',
        telefono: '88183631',
        correo_electronico: 'cjimenezrfwd@gmail.com',
        direccion: 'ZDNGZEDGHNRSEYXDG',
        pais: 'Costa Rica',
        relacion_con_atleta: 'Padre/Madre',
        experiencia_necesidades_especiales: 0, // false = 0 en MySQL
        status: 'ACTIVO',
        fecha_registro: new Date('2026-03-26T17:27:12.371Z'),
        updated_at: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tutores', null, {});
  }
};
