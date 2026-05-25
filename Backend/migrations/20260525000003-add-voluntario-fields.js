'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('voluntarios', 'terminos_aceptados', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('voluntarios', 'firma_voluntario', { type: Sequelize.STRING(255), allowNull: true }),
      queryInterface.addColumn('voluntarios', 'fecha_firma_voluntario', { type: Sequelize.DATEONLY, allowNull: true })
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('voluntarios', 'terminos_aceptados'),
      queryInterface.removeColumn('voluntarios', 'firma_voluntario'),
      queryInterface.removeColumn('voluntarios', 'fecha_firma_voluntario')
    ]);
  }
};
