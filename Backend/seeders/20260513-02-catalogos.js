'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // [verde] disciplinas: solo id, nombre, descripcion, activa (sin timestamps)
  // [verde] programas: solo id, nombre (sin timestamps)
  // [verde] niveles_habilidad: solo id, nombre (sin timestamps)
  async up(queryInterface, Sequelize) {

    // --- Disciplinas ---
    await queryInterface.bulkInsert('disciplinas', [
      { id: 1, nombre: 'Atletismo',              descripcion: null, activa: 1 },
      { id: 2, nombre: 'Natación',               descripcion: null, activa: 1 },
      { id: 3, nombre: 'Fútbol',                 descripcion: null, activa: 1 },
      { id: 4, nombre: 'Baloncesto',             descripcion: null, activa: 1 },
      { id: 5, nombre: 'Bochas',                 descripcion: null, activa: 1 },
      { id: 6, nombre: 'Tenis de Mesa',          descripcion: null, activa: 1 },
      { id: 7, nombre: 'Gimnasia',               descripcion: null, activa: 1 },
      { id: 8, nombre: 'Levantamiento de Pesas', descripcion: null, activa: 1 },
    ], { ignoreDuplicates: true });

    // --- Programas ---
    await queryInterface.bulkInsert('programas', [
      { id: 1, nombre: 'San José'   },
      { id: 2, nombre: 'Alajuela'   },
      { id: 3, nombre: 'Heredia'    },
      { id: 4, nombre: 'Cartago'    },
      { id: 5, nombre: 'Limón'      },
      { id: 6, nombre: 'Puntarenas' },
      { id: 7, nombre: 'Guanacaste' },
      { id: 8, nombre: 'San Carlos' },
    ], { ignoreDuplicates: true });

    // --- Niveles de habilidad ---
    await queryInterface.bulkInsert('niveles_habilidad', [
      { id: 1, nombre: 'Principiante' },
      { id: 2, nombre: 'Intermedio'   },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('niveles_habilidad', null, {});
    await queryInterface.bulkDelete('programas', null, {});
    await queryInterface.bulkDelete('disciplinas', null, {});
  }
};
