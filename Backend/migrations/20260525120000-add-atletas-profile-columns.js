'use strict';

/** Añade columnas del modelo Atleta que faltaban en la tabla (cedula, tutor, etc.) */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('atletas');

    const columns = {
      cedula: { type: Sequelize.STRING(50), allowNull: true },
      pais: { type: Sequelize.STRING(100), allowNull: true },
      direccion: { type: Sequelize.TEXT, allowNull: true },
      emergencia_nombre: { type: Sequelize.STRING(150), allowNull: true },
      emergencia_telefono: { type: Sequelize.STRING(20), allowNull: true },
      tutor_nombre: { type: Sequelize.STRING(100), allowNull: true },
      tutor_apellido: { type: Sequelize.STRING(100), allowNull: true },
      tutor_relacion: { type: Sequelize.STRING(50), allowNull: true },
      tutor_telefono: { type: Sequelize.STRING(20), allowNull: true },
      tutor_correo: { type: Sequelize.STRING(150), allowNull: true },
      tutor_pais: { type: Sequelize.STRING(100), allowNull: true },
      tutor_cedula: { type: Sequelize.STRING(50), allowNull: true },
      equipo: { type: Sequelize.STRING(100), allowNull: true },
      experiencia: { type: Sequelize.STRING(255), allowNull: true },
      proximos_retos: { type: Sequelize.TEXT, allowNull: true },
    };

    for (const [name, definition] of Object.entries(columns)) {
      if (!tableInfo[name]) {
        await queryInterface.addColumn('atletas', name, definition);
      }
    }
  },

  async down(queryInterface) {
    const cols = [
      'cedula',
      'pais',
      'direccion',
      'emergencia_nombre',
      'emergencia_telefono',
      'tutor_nombre',
      'tutor_apellido',
      'tutor_relacion',
      'tutor_telefono',
      'tutor_correo',
      'tutor_pais',
      'tutor_cedula',
      'equipo',
      'experiencia',
      'proximos_retos',
    ];
    const tableInfo = await queryInterface.describeTable('atletas');
    for (const col of cols) {
      if (tableInfo[col]) {
        await queryInterface.removeColumn('atletas', col);
      }
    }
  },
};
