/**
 * Auditoría de datos antes de aplicar CHECK constraints.
 * Ejecutar: node scripts/audit-check-constraints.js
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const RULES = [
  {
    id: 'usuarios_nombre_corto',
    table: 'usuarios',
    sql: `SELECT id, nombre FROM usuarios WHERE CHAR_LENGTH(TRIM(nombre)) < 2`,
  },
  {
    id: 'usuarios_apellido_corto',
    table: 'usuarios',
    sql: `SELECT id, apellido FROM usuarios WHERE CHAR_LENGTH(TRIM(apellido)) < 2`,
  },
  {
    id: 'usuarios_fecha_futura',
    table: 'usuarios',
    sql: `SELECT id, fecha_nacimiento FROM usuarios WHERE fecha_nacimiento IS NOT NULL AND fecha_nacimiento > CURDATE()`,
  },
  {
    id: 'usuarios_edad_max',
    table: 'usuarios',
    sql: `SELECT id, fecha_nacimiento FROM usuarios WHERE fecha_nacimiento IS NOT NULL AND TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) > 120`,
  },
  {
    id: 'atletas_nombre_corto',
    table: 'atletas',
    sql: `SELECT id, nombre FROM atletas WHERE CHAR_LENGTH(TRIM(nombre)) < 2`,
  },
  {
    id: 'atletas_apellido_corto',
    table: 'atletas',
    sql: `SELECT id, primer_apellido FROM atletas WHERE CHAR_LENGTH(TRIM(primer_apellido)) < 2`,
  },
  {
    id: 'atletas_fecha_futura',
    table: 'atletas',
    sql: `SELECT id, fecha_nacimiento FROM atletas WHERE fecha_nacimiento > CURDATE()`,
  },
  {
    id: 'atletas_edad_min',
    table: 'atletas',
    sql: `SELECT id, fecha_nacimiento FROM atletas WHERE TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 8`,
  },
  {
    id: 'atletas_edad_max',
    table: 'atletas',
    sql: `SELECT id, fecha_nacimiento FROM atletas WHERE TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) > 120`,
  },
  {
    id: 'entrenadores_nombre_corto',
    table: 'entrenadores',
    sql: `SELECT id, nombre FROM entrenadores WHERE CHAR_LENGTH(TRIM(nombre)) < 2`,
  },
  {
    id: 'entrenadores_apellido_corto',
    table: 'entrenadores',
    sql: `SELECT id, apellido FROM entrenadores WHERE CHAR_LENGTH(TRIM(apellido)) < 2`,
  },
  {
    id: 'entrenadores_fecha_futura',
    table: 'entrenadores',
    sql: `SELECT id, fecha_nacimiento FROM entrenadores WHERE fecha_nacimiento IS NOT NULL AND fecha_nacimiento > CURDATE()`,
  },
  {
    id: 'entrenadores_edad_min',
    table: 'entrenadores',
    sql: `SELECT id, fecha_nacimiento FROM entrenadores WHERE fecha_nacimiento IS NOT NULL AND TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 18`,
  },
  {
    id: 'entrenadores_edad_max',
    table: 'entrenadores',
    sql: `SELECT id, fecha_nacimiento FROM entrenadores WHERE fecha_nacimiento IS NOT NULL AND TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) > 120`,
  },
  {
    id: 'entrenadores_anios_exp',
    table: 'entrenadores',
    sql: `SELECT id, anios_experiencia FROM entrenadores WHERE anios_experiencia IS NOT NULL AND (anios_experiencia < 0 OR anios_experiencia > 99)`,
  },
  {
    id: 'voluntarios_nombre_corto',
    table: 'voluntarios',
    sql: `SELECT id, nombre FROM voluntarios WHERE CHAR_LENGTH(TRIM(nombre)) < 2`,
  },
  {
    id: 'voluntarios_apellido_corto',
    table: 'voluntarios',
    sql: `SELECT id, apellido FROM voluntarios WHERE CHAR_LENGTH(TRIM(apellido)) < 2`,
  },
  {
    id: 'voluntarios_fecha_futura',
    table: 'voluntarios',
    sql: `SELECT id, fecha_nacimiento FROM voluntarios WHERE fecha_nacimiento IS NOT NULL AND fecha_nacimiento > CURDATE()`,
  },
  {
    id: 'voluntarios_edad_min',
    table: 'voluntarios',
    sql: `SELECT id, fecha_nacimiento FROM voluntarios WHERE fecha_nacimiento IS NOT NULL AND TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 18`,
  },
  {
    id: 'voluntarios_edad_max',
    table: 'voluntarios',
    sql: `SELECT id, fecha_nacimiento FROM voluntarios WHERE fecha_nacimiento IS NOT NULL AND TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) > 120`,
  },
  {
    id: 'competiciones_fechas',
    table: 'competiciones',
    sql: `SELECT id, fecha_inicio, fecha_fin FROM competiciones WHERE fecha_fin IS NOT NULL AND fecha_fin < fecha_inicio`,
  },
  {
    id: 'competiciones_nombre_corto',
    table: 'competiciones',
    sql: `SELECT id, nombre FROM competiciones WHERE CHAR_LENGTH(TRIM(nombre)) < 2`,
  },
  {
    id: 'competicion_atletas_posicion',
    table: 'competicion_atletas',
    sql: `SELECT id, posicion FROM competicion_atletas WHERE posicion IS NOT NULL AND posicion < 1`,
  },
];

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'olimpiadas_db',
  });

  let totalViolations = 0;
  console.log('=== Auditoría CHECK constraints ===\n');

  for (const rule of RULES) {
    try {
      const [rows] = await conn.execute(rule.sql);
      const count = rows.length;
      totalViolations += count;
      const status = count === 0 ? 'OK' : 'FAIL';
      console.log(`[${status}] ${rule.id} (${rule.table}): ${count} fila(s)`);
      if (count > 0 && count <= 5) {
        rows.forEach((r) => console.log('   ', JSON.stringify(r)));
      } else if (count > 5) {
        rows.slice(0, 3).forEach((r) => console.log('   ', JSON.stringify(r)));
        console.log(`    ... y ${count - 3} más`);
      }
    } catch (err) {
      console.log(`[SKIP] ${rule.id}: ${err.message}`);
    }
  }

  console.log(`\nTotal violaciones: ${totalViolations}`);
  await conn.end();
  process.exit(totalViolations > 0 ? 1 : 0);
})().catch((err) => {
  console.error('Error:', err.message);
  process.exit(2);
});
