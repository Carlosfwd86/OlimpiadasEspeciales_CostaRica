'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // [verde] Inserta las 2 competiciones del db.json en la tabla 'competiciones'
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('competiciones', [
      {
        id: 1,
        disciplina_id: 4, // Baloncesto
        nombre: 'Torneo Nacional de Basket',
        fecha_inicio: '2026-03-30',
        fecha_fin: '2026-03-31',
        ubicacion: 'Estadio Nacional, San José',
        resumen: 'Gran evento nacional donde se reunirán los mejores equipos del país para celebrar la inclusión a través del deporte.',
        img_url: 'https://dotorg.brightspotcdn.com/dims4/default/e718c4e/2147483647/strip/true/crop/4344x2891+0+0/resize/800x532!/quality/90/?url=http%3A%2F%2Fsoi-brightspot.s3.amazonaws.com%2Fdotorg%2F8f%2F2d%2Fe455797841b180733b54828d564e%2F20180705-ajenner-bbo-52.jpg',
        enlace: 'https://share.google/6k2V0kEPTHfLB4uqj',
        status: 'Programado',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        disciplina_id: 2, // Natación
        nombre: 'Encuentro Regional de Natación',
        fecha_inicio: '2026-06-20',
        fecha_fin: null,
        ubicacion: 'Centro Acuático, La Sabana',
        resumen: 'Competencias de relevos y estilos libres para atletas de todas las regiones.',
        img_url: null,
        enlace: null,
        status: 'Programado',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('competiciones', null, {});
  }
};
