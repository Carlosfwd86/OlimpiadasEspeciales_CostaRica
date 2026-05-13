'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // [verde] voluntarios: id, usuario_id, nombre, apellido, cedula, fecha_nacimiento,
  //                      genero, telefono, correo_electronico, otra_area, disponibilidad,
  //                      experiencia_previa, status, fecha_registro, fecha_aprobacion,
  //                      created_at, updated_at
  // [verde] NOTA: No tiene columna 'direccion' — la tabla no la incluye en la migración
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('voluntarios', [
      {
        id: 1,
        usuario_id: null,
        nombre: 'francela',
        apellido: 'porras',
        cedula: '1111111',     // cedula única, ajustada para evitar duplicado
        fecha_nacimiento: '1990-01-01',
        genero: 'Masculino',
        telefono: '45789055',
        correo_electronico: 'nporrasafwd@gmail.com',
        otra_area: 'en fotografia',
        disponibilidad: 'sabado temprano',
        experiencia_previa: 'no',
        status: 'ACTIVO',
        fecha_registro: new Date('2026-03-29T18:02:40.730Z'),
        fecha_aprobacion: new Date('2026-03-29T18:05:08.375Z'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('voluntarios', null, {});
  }
};
