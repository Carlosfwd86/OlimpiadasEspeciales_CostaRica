'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('entrenadores', 'otros_dispositivos', { type: Sequelize.TEXT, allowNull: true }),
      queryInterface.addColumn('entrenadores', 'especificacion_otros_dispositivos', { type: Sequelize.TEXT, allowNull: true }),
      queryInterface.addColumn('entrenadores', 'terminos_aceptados', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('entrenadores', 'firma_entrenador', { type: Sequelize.STRING(255), allowNull: true }),
      queryInterface.addColumn('entrenadores', 'fecha_firma_entrenador', { type: Sequelize.DATEONLY, allowNull: true })
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('entrenadores', 'otros_dispositivos'),
      queryInterface.removeColumn('entrenadores', 'especificacion_otros_dispositivos'),
      queryInterface.removeColumn('entrenadores', 'terminos_aceptados'),
      queryInterface.removeColumn('entrenadores', 'firma_entrenador'),
      queryInterface.removeColumn('entrenadores', 'fecha_firma_entrenador')
    ]);
  }
};
