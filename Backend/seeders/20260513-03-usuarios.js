'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // [verde] Inserta todos los usuarios del db.json en la tabla 'usuarios'
  // Roles: 1=admin, 2=atleta, 3=entrenador, 4=voluntario, 5=tutor, 6=usuario
  async up(queryInterface, Sequelize) {
    const hash = (pw) => bcrypt.hashSync(pw || 'Olimpiadas2026!', 10);

    await queryInterface.bulkInsert('usuarios', [
      // Admin del sistema
      {
        id: 1,
        rol_id: 1,
        nombre: 'Admin',
        apellido: 'Sistema',
        cedula: null,
        correo_electronico: 'admin@gmail.com',
        password_hash: hash('admin123'),
        telefono: '1234567',
        direccion: null,
        pais: 'Costa Rica',
        fecha_nacimiento: null,
        genero: null,
        status: 'ACTIVO',
        fecha_registro: new Date('2026-01-01'),
        updated_at: new Date()
      },
      // Gerson Dinarte (atleta/usuario)
      {
        id: 2,
        rol_id: 6,
        nombre: 'Gerson',
        apellido: 'Dinarte',
        cedula: null,
        correo_electronico: 'dinartegerson@gmail.com',
        password_hash: hash('123456789'),
        telefono: null,
        direccion: null,
        pais: 'Costa Rica',
        fecha_nacimiento: null,
        genero: null,
        status: 'ACTIVO',
        fecha_registro: new Date('2026-03-26T21:44:20.764Z'),
        updated_at: new Date()
      },
      // Saul Jimenez (entrenador)
      {
        id: 3,
        rol_id: 3,
        nombre: 'Saul Andres',
        apellido: 'Jimenez Villalobos',
        cedula: null,
        correo_electronico: 'saujivi@gmail.com',
        password_hash: hash('saujivi'),
        telefono: null,
        direccion: null,
        pais: null,
        fecha_nacimiento: null,
        genero: null,
        status: 'ACTIVO',
        fecha_registro: new Date('2026-03-27T05:39:00.440Z'),
        updated_at: new Date()
      },
      // Isaac Jimenez (usuario)
      {
        id: 4,
        rol_id: 6,
        nombre: 'Isaac Josue',
        apellido: 'Jimenez Villalobos',
        cedula: null,
        correo_electronico: 'isajivi@gmail.com',
        password_hash: hash('isajivi'),
        telefono: null,
        direccion: null,
        pais: null,
        fecha_nacimiento: null,
        genero: null,
        status: 'ACTIVO',
        fecha_registro: new Date('2026-03-27T06:09:47.695Z'),
        updated_at: new Date()
      },
      // Cinthia Villalobos (atleta)
      {
        id: 5,
        rol_id: 2,
        nombre: 'Cinthia',
        apellido: 'Villalobos Campos',
        cedula: '601780178',
        correo_electronico: 'cinvilla@gmail.com',
        password_hash: hash('cinvilla'),
        telefono: '88506060',
        direccion: null,
        pais: 'Panama',
        fecha_nacimiento: null,
        genero: null,
        status: 'ACTIVO',
        fecha_registro: new Date('2026-03-27T06:22:56.317Z'),
        updated_at: new Date()
      },
      // Carlos Jimenez (voluntario)
      {
        id: 6,
        rol_id: 4,
        nombre: 'Carlos Andres',
        apellido: 'Jimenez Rojas',
        cedula: '603550322',
        correo_electronico: 'cjimenezrfwd@gmail.com',
        password_hash: hash('carlosji'),
        telefono: '88183631',
        direccion: null,
        pais: 'Costa Rica',
        fecha_nacimiento: null,
        genero: null,
        status: 'ACTIVO',
        fecha_registro: new Date('2026-03-27T06:48:21.479Z'),
        updated_at: new Date()
      },
      // Keylor Gonzalez (usuario)
      {
        id: 7,
        rol_id: 6,
        nombre: 'Keylor',
        apellido: 'Gonzalez',
        cedula: '604880955',
        correo_electronico: 'keylor@gmail.com',
        password_hash: hash('keylor'),
        telefono: '85864545',
        direccion: null,
        pais: null,
        fecha_nacimiento: null,
        genero: null,
        status: 'ACTIVO',
        fecha_registro: new Date('2026-03-27T11:44:01.262Z'),
        updated_at: new Date()
      },
      // Braksley Camacho (atleta)
      {
        id: 8,
        rol_id: 2,
        nombre: 'Braksley',
        apellido: 'Camacho Garcia',
        cedula: '605100869',
        correo_electronico: 'bcamachogfwd@gmail.com',
        password_hash: hash('holaamigoscomoestan'),
        telefono: '63511090',
        direccion: 'Atras de mi casa del rio',
        pais: 'Costa Rica',
        fecha_nacimiento: '2008-02-20',
        genero: 'Masculino',
        status: 'ACTIVO',
        fecha_registro: new Date('2026-03-27T19:26:12.146Z'),
        updated_at: new Date()
      },
      // Manuel Fernandez (usuario)
      {
        id: 9,
        rol_id: 6,
        nombre: 'Manuel',
        apellido: 'Fernandez',
        cedula: null,
        correo_electronico: 'maruchan2020@gmail.com',
        password_hash: hash('hola123'),
        telefono: null,
        direccion: null,
        pais: 'Venezuela',
        fecha_nacimiento: '2001-02-10',
        genero: 'Femenino',
        status: 'ACTIVO',
        fecha_registro: new Date('2026-03-27T21:05:10.613Z'),
        updated_at: new Date()
      },
      // Andres (usuario)
      {
        id: 10,
        rol_id: 6,
        nombre: 'Andres',
        apellido: 'Jimenez',
        cedula: null,
        correo_electronico: 'cajr1986@gmail.com',
        password_hash: hash('Carlos'),
        telefono: null,
        direccion: null,
        pais: null,
        fecha_nacimiento: '1986-05-18',
        genero: 'Masculino',
        status: 'ACTIVO',
        fecha_registro: new Date('2026-03-29T01:24:34.378Z'),
        updated_at: new Date()
      },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
