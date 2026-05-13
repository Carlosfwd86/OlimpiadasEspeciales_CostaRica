'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // [verde] Inserta el entrenador del db.json en la tabla 'entrenadores'
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('entrenadores', [
      {
        id: 1,
        usuario_id: null,
        disciplina_id: 1, // Atletismo
        nombre: 'francela',
        apellido: 'porras',
        cedula: '11111111',
        fecha_nacimiento: '1990-01-01', // Fecha original inválida (0002), se normaliza
        genero: 'Femenino',
        telefono: '45789055',
        correo_electronico: 'nporrasafwd@gmail.com',
        anios_experiencia: 3,
        certificaciones: 'muchas corridas',
        horario_disponible: 'de lunes a miercoles',
        afeccion_salud: false,
        detalle_salud: null,
        status: 'ACTIVO',
        fecha_registro: new Date('2026-03-29T18:08:21.677Z'),
        fecha_aprobacion: new Date('2026-03-29T18:09:36.401Z'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('entrenadores', null, {});
  }
};
