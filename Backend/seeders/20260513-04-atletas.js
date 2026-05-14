'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // [verde] Atletas: id, nombre, primer_apellido, segundo_apellido, fecha_nacimiento,
  //                  genero, telefono, correo_electronico, fecha_registro (sin timestamps extra)
  // [verde] Condiciones: id, atleta_id, condicion (sin timestamps)
  // [verde] Dispositivos: id, atleta_id, tipo (ENUM), nombre (sin timestamps)
  // [verde] Medicamentos: id, atleta_id, nombre, dosis, frecuencia (sin timestamps)
  async up(queryInterface, Sequelize) {

    // ── 1. ATLETAS BASE ──────────────────────────────────────────────────────
    await queryInterface.bulkInsert('atletas', [
      {
        id: 1,
        nombre: 'carlosfwd',
        primer_apellido: 'N/A',
        segundo_apellido: null,
        fecha_nacimiento: '2000-01-01',
        genero: 'Masculino',
        telefono: '123456789',
        correo_electronico: 'carlos@gmail.com',
        fecha_registro: new Date('2026-03-24T20:00:29.797Z')
      },
      {
        id: 2,
        nombre: 'franshsko',
        primer_apellido: 'porras',
        segundo_apellido: null,
        fecha_nacimiento: '2000-01-01',
        genero: 'Masculino',
        telefono: '3535364364',
        correo_electronico: 'nporrasafwd@gmail.com',
        fecha_registro: new Date('2026-03-29T01:48:11.205Z')
      },
      {
        id: 3,
        nombre: 'salomon',
        primer_apellido: 'porras',
        segundo_apellido: null,
        fecha_nacimiento: '2000-01-01',
        genero: 'Masculino',
        telefono: '12345678910',
        correo_electronico: 'nporrasafwd@gmail.com',
        fecha_registro: new Date('2026-03-29T19:10:39.784Z')
      },
      {
        id: 4,
        nombre: 'Gerson David',
        primer_apellido: 'Dinarte',
        segundo_apellido: 'Fuentes',
        fecha_nacimiento: '2006-01-01',
        genero: 'Masculino',
        telefono: '89074567',
        correo_electronico: 'gfuentesfwd@gmail.com',
        fecha_registro: new Date('2026-03-30T17:10:51.149Z')
      },
      {
        id: 5,
        nombre: 'keysha',
        primer_apellido: 'N/A',
        segundo_apellido: null,
        fecha_nacimiento: '2006-01-01',
        genero: 'Femenino',
        telefono: '89074567',
        correo_electronico: 'key@gmail.com',
        fecha_registro: new Date('2026-03-30T17:43:33.118Z')
      },
      {
        id: 6,
        nombre: 'Mauricio',
        primer_apellido: 'Perez',
        segundo_apellido: 'Solis',
        fecha_nacimiento: '2007-02-12',
        genero: 'Masculino',
        telefono: '63511090',
        correo_electronico: 'camaron@gmail.com',
        fecha_registro: new Date('2026-03-30T20:02:50.762Z')
      },
    ], { ignoreDuplicates: true });

    // ── 2. CONDICIONES MÉDICAS (sin timestamps) ──────────────────────────────
    await queryInterface.bulkInsert('atleta_condiciones', [
      { atleta_id: 1, condicion: 'Síndrome De Marfan' },
      { atleta_id: 5, condicion: 'Parálisis Cerebral' },
      { atleta_id: 6, condicion: 'Síndrome de Down'   },
    ], { ignoreDuplicates: true });

    // ── 3. DISPOSITIVOS (tipo ENUM: movilidad | medico | vida | comunicacion) ─
    await queryInterface.bulkInsert('atleta_dispositivos', [
      { atleta_id: 1, tipo: 'movilidad',    nombre: 'Caminador'                             },
      { atleta_id: 1, tipo: 'vida',         nombre: 'Gafas/lentes de contacto'              },
      { atleta_id: 1, tipo: 'medico',       nombre: 'Desfibrilador cardioversor implantable'},
      { atleta_id: 5, tipo: 'movilidad',    nombre: 'Caminador'                             },
      { atleta_id: 5, tipo: 'vida',         nombre: 'Dentadura postiza'                     },
      { atleta_id: 5, tipo: 'comunicacion', nombre: 'Audífono'                              },
      { atleta_id: 6, tipo: 'movilidad',    nombre: 'Caminador'                             },
      { atleta_id: 6, tipo: 'comunicacion', nombre: 'Dispositivos de comunicación'          },
    ], { ignoreDuplicates: true });

    // ── 4. MEDICAMENTOS (sin timestamps) ────────────────────────────────────
    await queryInterface.bulkInsert('atleta_medicamentos', [
      { atleta_id: 6, nombre: 'zabutaml', dosis: '2 gramos', frecuencia: '2 veces a la semana' },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('atleta_medicamentos', null, {});
    await queryInterface.bulkDelete('atleta_dispositivos', null, {});
    await queryInterface.bulkDelete('atleta_condiciones', null, {});
    await queryInterface.bulkDelete('atletas', null, {});
  }
};
