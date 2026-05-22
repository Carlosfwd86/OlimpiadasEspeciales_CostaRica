'use strict';

/**
 * Corrige filas que impedirían aplicar CHECK constraints en tablas core.
 */
module.exports = {
  async up(queryInterface) {
    const sequelize = queryInterface.sequelize;

    const [usuariosApellido] = await sequelize.query(
      `SELECT id FROM usuarios WHERE CHAR_LENGTH(TRIM(apellido)) < 2`
    );
    if (usuariosApellido.length > 0) {
      await sequelize.query(
        `UPDATE usuarios SET apellido = 'Usuario' WHERE CHAR_LENGTH(TRIM(apellido)) < 2`
      );
      console.log(`[remediate] usuarios.apellido corto: ${usuariosApellido.length} fila(s) actualizada(s)`);
    }

    const [entrenadoresEdad] = await sequelize.query(
      `SELECT id FROM entrenadores
       WHERE fecha_nacimiento IS NOT NULL
         AND (fecha_nacimiento > CURDATE()
              OR TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) > 120
              OR TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 18)`
    );
    if (entrenadoresEdad.length > 0) {
      await sequelize.query(
        `UPDATE entrenadores SET fecha_nacimiento = NULL
         WHERE fecha_nacimiento IS NOT NULL
           AND (fecha_nacimiento > CURDATE()
                OR TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) > 120
                OR TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 18)`
      );
      console.log(`[remediate] entrenadores.fecha_nacimiento inválida: ${entrenadoresEdad.length} fila(s) → NULL`);
    }

    const [voluntariosEdad] = await sequelize.query(
      `SELECT id FROM voluntarios
       WHERE fecha_nacimiento IS NOT NULL
         AND (fecha_nacimiento > CURDATE()
              OR TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) > 120
              OR TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 18)`
    );
    if (voluntariosEdad.length > 0) {
      await sequelize.query(
        `UPDATE voluntarios SET fecha_nacimiento = NULL
         WHERE fecha_nacimiento IS NOT NULL
           AND (fecha_nacimiento > CURDATE()
                OR TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) > 120
                OR TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 18)`
      );
      console.log(`[remediate] voluntarios.fecha_nacimiento inválida: ${voluntariosEdad.length} fila(s) → NULL`);
    }

    const [compFechas] = await sequelize.query(
      `SELECT id FROM competiciones WHERE fecha_fin IS NOT NULL AND fecha_fin < fecha_inicio`
    );
    if (compFechas.length > 0) {
      await sequelize.query(
        `UPDATE competiciones SET fecha_fin = fecha_inicio
         WHERE fecha_fin IS NOT NULL AND fecha_fin < fecha_inicio`
      );
      console.log(`[remediate] competiciones.fecha_fin: ${compFechas.length} fila(s) ajustada(s)`);
    }

    const [aniosExp] = await sequelize.query(
      `SELECT id FROM entrenadores
       WHERE anios_experiencia IS NOT NULL AND (anios_experiencia < 0 OR anios_experiencia > 99)`
    );
    if (aniosExp.length > 0) {
      await sequelize.query(
        `UPDATE entrenadores SET anios_experiencia = LEAST(99, GREATEST(0, anios_experiencia))
         WHERE anios_experiencia IS NOT NULL AND (anios_experiencia < 0 OR anios_experiencia > 99)`
      );
      console.log(`[remediate] entrenadores.anios_experiencia: ${aniosExp.length} fila(s) ajustada(s)`);
    }
  },

  async down() {
    // Los remedios de datos no se revierten automáticamente.
  },
};
