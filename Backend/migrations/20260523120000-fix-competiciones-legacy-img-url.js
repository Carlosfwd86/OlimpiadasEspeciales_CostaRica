'use strict';

/** Corrige img_url con dominio oe.cr (no resuelve) → ruta S3 usada en el frontend */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE competiciones
      SET img_url = 'img/Hero_contenedor_02.jpeg'
      WHERE img_url LIKE '%oe.cr%'
    `);
  },

  async down() {
    // No se revierte: el valor anterior era inválido
  },
};
