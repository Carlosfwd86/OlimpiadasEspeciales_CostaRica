'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('registro_pendiente_documentos', 'estado_ia', {
      type: Sequelize.ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO', 'NO_APLICA'),
      defaultValue: 'PENDIENTE',
      allowNull: false,
      after: 'tamano_bytes',
    });

    await queryInterface.addColumn('registro_pendiente_documentos', 'analisis_ia', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: 'Retroalimentación automática generada por OpenAI (gpt-4o)',
      after: 'estado_ia',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('registro_pendiente_documentos', 'analisis_ia');
    await queryInterface.removeColumn('registro_pendiente_documentos', 'estado_ia');
    // Limpiar el tipo ENUM
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS `enum_registro_pendiente_documentos_estado_ia`;"
    ).catch(() => {}); // silenciar si no existe (MySQL lo elimina con la columna)
  },
};
