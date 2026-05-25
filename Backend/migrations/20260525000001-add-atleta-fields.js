'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Campos nuevos requeridos por el formulario de atleta
    await Promise.all([
      queryInterface.addColumn('atletas', 'disciplina_id', { type: Sequelize.INTEGER, allowNull: true }),
      queryInterface.addColumn('atletas', 'req_dietetico', { type: Sequelize.STRING(100), allowNull: true }),
      queryInterface.addColumn('atletas', 'especificacion_dietetico', { type: Sequelize.TEXT, allowNull: true }),
      queryInterface.addColumn('atletas', 'otros_dispositivos', { type: Sequelize.TEXT, allowNull: true }),
      queryInterface.addColumn('atletas', 'especificacion_otros_dispositivos', { type: Sequelize.TEXT, allowNull: true }),
      queryInterface.addColumn('atletas', 'afeccion_cardiaca', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'asma', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'diabetes', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'disc_visual', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'disc_auditiva', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'trastorno_hemorragico', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'medico_limito_deportes', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'epilepsia_convulsivo', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'anemia_depranocitica', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'conmocion_cerebral', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'cantidad_conmociones', { type: Sequelize.INTEGER, allowNull: true }),
      queryInterface.addColumn('atletas', 'fecha_ultima_conmocion', { type: Sequelize.DATEONLY, allowNull: true }),
      queryInterface.addColumn('atletas', 'afecciones_mentales', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'especificacion_afecciones_mentales', { type: Sequelize.TEXT, allowNull: true }),
      queryInterface.addColumn('atletas', 'alergias_graves', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'toma_medicamentos', { type: Sequelize.STRING(100), allowNull: true }),
      queryInterface.addColumn('atletas', 'terminos_aceptados', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'objecion_tratamiento_medico', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'objecion_transfusiones', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }),
      queryInterface.addColumn('atletas', 'firma_atleta', { type: Sequelize.STRING(255), allowNull: true }),
      queryInterface.addColumn('atletas', 'fecha_firma_atleta', { type: Sequelize.DATEONLY, allowNull: true }),
      queryInterface.addColumn('atletas', 'firma_tutor', { type: Sequelize.STRING(255), allowNull: true }),
      queryInterface.addColumn('atletas', 'relacion_tutor', { type: Sequelize.STRING(100), allowNull: true }),
      queryInterface.addColumn('atletas', 'fecha_firma_tutor', { type: Sequelize.DATEONLY, allowNull: true }),
      queryInterface.addColumn('atletas', 'interes_investigacion', { type: Sequelize.STRING(100), allowNull: true }),
      queryInterface.addColumn('atletas', 'relacion_atleta', { type: Sequelize.STRING(100), allowNull: true }),
      queryInterface.addColumn('atletas', 'relacion_atleta_otro', { type: Sequelize.STRING(255), allowNull: true })
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('atletas', 'disciplina_id'),
      queryInterface.removeColumn('atletas', 'req_dietetico'),
      queryInterface.removeColumn('atletas', 'especificacion_dietetico'),
      queryInterface.removeColumn('atletas', 'otros_dispositivos'),
      queryInterface.removeColumn('atletas', 'especificacion_otros_dispositivos'),
      queryInterface.removeColumn('atletas', 'afeccion_cardiaca'),
      queryInterface.removeColumn('atletas', 'asma'),
      queryInterface.removeColumn('atletas', 'diabetes'),
      queryInterface.removeColumn('atletas', 'disc_visual'),
      queryInterface.removeColumn('atletas', 'disc_auditiva'),
      queryInterface.removeColumn('atletas', 'trastorno_hemorragico'),
      queryInterface.removeColumn('atletas', 'medico_limito_deportes'),
      queryInterface.removeColumn('atletas', 'epilepsia_convulsivo'),
      queryInterface.removeColumn('atletas', 'anemia_depranocitica'),
      queryInterface.removeColumn('atletas', 'conmocion_cerebral'),
      queryInterface.removeColumn('atletas', 'cantidad_conmociones'),
      queryInterface.removeColumn('atletas', 'fecha_ultima_conmocion'),
      queryInterface.removeColumn('atletas', 'afecciones_mentales'),
      queryInterface.removeColumn('atletas', 'especificacion_afecciones_mentales'),
      queryInterface.removeColumn('atletas', 'alergias_graves'),
      queryInterface.removeColumn('atletas', 'toma_medicamentos'),
      queryInterface.removeColumn('atletas', 'terminos_aceptados'),
      queryInterface.removeColumn('atletas', 'objecion_tratamiento_medico'),
      queryInterface.removeColumn('atletas', 'objecion_transfusiones'),
      queryInterface.removeColumn('atletas', 'firma_atleta'),
      queryInterface.removeColumn('atletas', 'fecha_firma_atleta'),
      queryInterface.removeColumn('atletas', 'firma_tutor'),
      queryInterface.removeColumn('atletas', 'relacion_tutor'),
      queryInterface.removeColumn('atletas', 'fecha_firma_tutor'),
      queryInterface.removeColumn('atletas', 'interes_investigacion'),
      queryInterface.removeColumn('atletas', 'relacion_atleta'),
      queryInterface.removeColumn('atletas', 'relacion_atleta_otro')
    ]);
  }
};
