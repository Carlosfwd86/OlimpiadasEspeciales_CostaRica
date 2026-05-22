'use strict';

function toDateStr(d) {
  return d.toISOString().slice(0, 10);
}

function buildDateBounds() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();
  return {
    today: toDateStr(today),
    atletaMaxBirth: toDateStr(new Date(y - 120, m, d)),
    atletaMinBirth: toDateStr(new Date(y - 8, m, d)),
    adultMinBirth: toDateStr(new Date(y - 18, m, d)),
  };
}

async function constraintExists(queryInterface, tableName, constraintName) {
  const schema = queryInterface.sequelize.config.database;
  const [rows] = await queryInterface.sequelize.query(
    `SELECT 1 FROM information_schema.TABLE_CONSTRAINTS
     WHERE CONSTRAINT_SCHEMA = :schema
       AND TABLE_NAME = :table
       AND CONSTRAINT_NAME = :name
       AND CONSTRAINT_TYPE = 'CHECK'
     LIMIT 1`,
    { replacements: { schema, table: tableName, name: constraintName } }
  );
  return rows.length > 0;
}

async function addCheck(queryInterface, tableName, constraintName, checkSql) {
  if (await constraintExists(queryInterface, tableName, constraintName)) {
    console.log(`[skip] ${constraintName} ya existe`);
    return;
  }
  await queryInterface.sequelize.query(
    `ALTER TABLE \`${tableName}\` ADD CONSTRAINT \`${constraintName}\` CHECK (${checkSql})`
  );
  console.log(`[add] ${constraintName}`);
}

async function dropCheck(queryInterface, tableName, constraintName) {
  if (!(await constraintExists(queryInterface, tableName, constraintName))) return;
  await queryInterface.sequelize.query(
    `ALTER TABLE \`${tableName}\` DROP CHECK \`${constraintName}\``
  );
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const dates = buildDateBounds();

    // --- usuarios ---
    await addCheck(queryInterface, 'usuarios', 'chk_usuarios_nombre',
      'CHAR_LENGTH(TRIM(nombre)) >= 2');
    await addCheck(queryInterface, 'usuarios', 'chk_usuarios_apellido',
      'CHAR_LENGTH(TRIM(apellido)) >= 2');
    await addCheck(queryInterface, 'usuarios', 'chk_usuarios_fecha_nac',
      `(fecha_nacimiento IS NULL OR fecha_nacimiento <= '${dates.today}')`);
    await addCheck(queryInterface, 'usuarios', 'chk_usuarios_edad_max',
      `(fecha_nacimiento IS NULL OR fecha_nacimiento >= '${dates.atletaMaxBirth}')`);

    // --- atletas ---
    await addCheck(queryInterface, 'atletas', 'chk_atletas_nombre',
      'CHAR_LENGTH(TRIM(nombre)) >= 2');
    await addCheck(queryInterface, 'atletas', 'chk_atletas_primer_apellido',
      'CHAR_LENGTH(TRIM(primer_apellido)) >= 2');
    await addCheck(queryInterface, 'atletas', 'chk_atletas_fecha_nac',
      `fecha_nacimiento <= '${dates.today}'`);
    await addCheck(queryInterface, 'atletas', 'chk_atletas_edad_min',
      `fecha_nacimiento <= '${dates.atletaMinBirth}'`);
    await addCheck(queryInterface, 'atletas', 'chk_atletas_edad_max',
      `fecha_nacimiento >= '${dates.atletaMaxBirth}'`);

    // --- entrenadores ---
    await addCheck(queryInterface, 'entrenadores', 'chk_entrenadores_nombre',
      'CHAR_LENGTH(TRIM(nombre)) >= 2');
    await addCheck(queryInterface, 'entrenadores', 'chk_entrenadores_apellido',
      'CHAR_LENGTH(TRIM(apellido)) >= 2');
    await addCheck(queryInterface, 'entrenadores', 'chk_entrenadores_fecha_nac',
      `(fecha_nacimiento IS NULL OR fecha_nacimiento <= '${dates.today}')`);
    await addCheck(queryInterface, 'entrenadores', 'chk_entrenadores_edad_min',
      `(fecha_nacimiento IS NULL OR fecha_nacimiento <= '${dates.adultMinBirth}')`);
    await addCheck(queryInterface, 'entrenadores', 'chk_entrenadores_edad_max',
      `(fecha_nacimiento IS NULL OR fecha_nacimiento >= '${dates.atletaMaxBirth}')`);
    await addCheck(queryInterface, 'entrenadores', 'chk_entrenadores_anios_exp',
      '(anios_experiencia IS NULL OR (anios_experiencia >= 0 AND anios_experiencia <= 99))');

    // --- voluntarios ---
    await addCheck(queryInterface, 'voluntarios', 'chk_voluntarios_nombre',
      'CHAR_LENGTH(TRIM(nombre)) >= 2');
    await addCheck(queryInterface, 'voluntarios', 'chk_voluntarios_apellido',
      'CHAR_LENGTH(TRIM(apellido)) >= 2');
    await addCheck(queryInterface, 'voluntarios', 'chk_voluntarios_fecha_nac',
      `(fecha_nacimiento IS NULL OR fecha_nacimiento <= '${dates.today}')`);
    await addCheck(queryInterface, 'voluntarios', 'chk_voluntarios_edad_min',
      `(fecha_nacimiento IS NULL OR fecha_nacimiento <= '${dates.adultMinBirth}')`);
    await addCheck(queryInterface, 'voluntarios', 'chk_voluntarios_edad_max',
      `(fecha_nacimiento IS NULL OR fecha_nacimiento >= '${dates.atletaMaxBirth}')`);

    // --- competiciones ---
    await addCheck(queryInterface, 'competiciones', 'chk_competiciones_nombre',
      'CHAR_LENGTH(TRIM(nombre)) >= 2');
    await addCheck(queryInterface, 'competiciones', 'chk_competiciones_fechas',
      '(fecha_fin IS NULL OR fecha_fin >= fecha_inicio)');

    // --- competicion_atletas ---
    await addCheck(queryInterface, 'competicion_atletas', 'chk_competicion_atletas_posicion',
      '(posicion IS NULL OR posicion >= 1)');
  },

  async down(queryInterface) {
    const drops = [
      ['competicion_atletas', 'chk_competicion_atletas_posicion'],
      ['competiciones', 'chk_competiciones_fechas'],
      ['competiciones', 'chk_competiciones_nombre'],
      ['voluntarios', 'chk_voluntarios_edad_max'],
      ['voluntarios', 'chk_voluntarios_edad_min'],
      ['voluntarios', 'chk_voluntarios_fecha_nac'],
      ['voluntarios', 'chk_voluntarios_apellido'],
      ['voluntarios', 'chk_voluntarios_nombre'],
      ['entrenadores', 'chk_entrenadores_anios_exp'],
      ['entrenadores', 'chk_entrenadores_edad_max'],
      ['entrenadores', 'chk_entrenadores_edad_min'],
      ['entrenadores', 'chk_entrenadores_fecha_nac'],
      ['entrenadores', 'chk_entrenadores_apellido'],
      ['entrenadores', 'chk_entrenadores_nombre'],
      ['atletas', 'chk_atletas_edad_max'],
      ['atletas', 'chk_atletas_edad_min'],
      ['atletas', 'chk_atletas_fecha_nac'],
      ['atletas', 'chk_atletas_primer_apellido'],
      ['atletas', 'chk_atletas_nombre'],
      ['usuarios', 'chk_usuarios_edad_max'],
      ['usuarios', 'chk_usuarios_fecha_nac'],
      ['usuarios', 'chk_usuarios_apellido'],
      ['usuarios', 'chk_usuarios_nombre'],
    ];
    for (const [table, name] of drops) {
      await dropCheck(queryInterface, table, name);
    }
  },
};
