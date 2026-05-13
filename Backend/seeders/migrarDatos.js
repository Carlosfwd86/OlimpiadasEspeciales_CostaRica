/**
 * ============================================================
 * SCRIPT DE MIGRACIÓN DE DATOS: db.json → MySQL
 * Olimpiadas Especiales Costa Rica
 * ============================================================
 * [verde] Ejecutar con: node Backend/seeders/migrarDatos.js
 * ============================================================
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Sequelize, DataTypes } = require('sequelize');

// [verde] Conexión directa a la base de datos MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Silenciar logs de SQL para una salida limpia
  }
);

// ============================================================
// [verde] DATOS EXTRAÍDOS Y LIMPIOS DEL db.json
// ============================================================

// --- 1. ATLETAS (tabla: atletas + tablas relacionadas de salud) ---
const atletasData = [
  {
    atleta: {
      nombre: 'carlosfwd',
      primer_apellido: '',
      segundo_apellido: '',
      fecha_nacimiento: '2018-02-23',
      genero: 'Masculino',
      telefono: '123456789',
      correo_electronico: 'carlos@gmail.com',
      fecha_registro: '2026-03-24T20:00:29.797Z',
    },
    condiciones: ['Síndrome De Marfan'],
    dispositivos: [
      { tipo: 'movilidad', nombre: 'Caminador' },
      { tipo: 'vida', nombre: 'Gafas/lentes de contacto' },
      { tipo: 'medico', nombre: 'Desfibrilador cardioversor implantable' },
    ],
    medicamentos: [],
    alergias: [],
  },
  {
    atleta: {
      nombre: 'franshsko',
      primer_apellido: 'porras',
      segundo_apellido: '',
      fecha_nacimiento: '2000-01-01',
      genero: 'Masculino',
      telefono: '3535364364',
      correo_electronico: 'nporrasafwd@gmail.com',
      fecha_registro: '2026-03-29T01:48:11.205Z',
    },
    condiciones: [],
    dispositivos: [],
    medicamentos: [],
    alergias: [],
  },
  {
    atleta: {
      nombre: 'salomon',
      primer_apellido: 'porras',
      segundo_apellido: '',
      fecha_nacimiento: '2000-01-01',
      genero: 'Masculino',
      telefono: '12345678910',
      correo_electronico: 'nporrasafwd@gmail.com',
      fecha_registro: '2026-03-29T19:10:39.784Z',
    },
    condiciones: [],
    dispositivos: [],
    medicamentos: [],
    alergias: [],
  },
  {
    atleta: {
      nombre: 'Gerson David',
      primer_apellido: 'Dinarte',
      segundo_apellido: 'Fuentes',
      fecha_nacimiento: '2006-01-01',
      genero: 'Masculino',
      telefono: '89074567',
      correo_electronico: 'gfuentesfwd@gmail.com',
      fecha_registro: '2026-03-30T17:10:51.149Z',
    },
    condiciones: [],
    dispositivos: [],
    medicamentos: [],
    alergias: [],
  },
  {
    atleta: {
      nombre: 'keysha',
      primer_apellido: '',
      segundo_apellido: '',
      fecha_nacimiento: '2026-07-19',
      genero: 'Femenino',
      telefono: '89074567',
      correo_electronico: 'key@gmail.com',
      fecha_registro: '2026-03-30T17:43:33.118Z',
    },
    condiciones: ['Parálisis Cerebral'],
    dispositivos: [
      { tipo: 'movilidad', nombre: 'Caminador' },
      { tipo: 'vida', nombre: 'Dentadura postiza' },
      { tipo: 'comunicacion', nombre: 'Audífono' },
    ],
    medicamentos: [],
    alergias: [],
  },
  {
    atleta: {
      nombre: 'Mauricio',
      primer_apellido: 'Perez',
      segundo_apellido: 'Solis',
      fecha_nacimiento: '2007-02-12',
      genero: 'Masculino',
      telefono: '63511090',
      correo_electronico: 'camaron@gmail.com',
      fecha_registro: '2026-03-30T20:02:50.762Z',
    },
    condiciones: ['Síndrome de Down'],
    dispositivos: [
      { tipo: 'movilidad', nombre: 'Caminador' },
      { tipo: 'comunicacion', nombre: 'Dispositivos de comunicación' },
    ],
    medicamentos: [
      { nombre: 'zabutaml', dosis: '2 gramos', frecuencia: '2 veces a la semana' },
    ],
    alergias: [],
  },
];

// ============================================================
// [verde] FUNCIÓN PRINCIPAL DE MIGRACIÓN
// ============================================================
async function migrarDatos() {
  try {
    await sequelize.authenticate();
    console.log('\n✅ Conexión a MySQL establecida correctamente.\n');

    // Sincronizar modelos (crear tablas si no existen, sin borrar datos)
    await sequelize.query(`SET FOREIGN_KEY_CHECKS = 0`);

    console.log('🔄 Iniciando migración de Atletas y sus datos de salud...\n');

    let atletasInsertados = 0;

    for (const entrada of atletasData) {
      const { atleta, condiciones, dispositivos, medicamentos, alergias } = entrada;

      // [verde] 1. Insertar el atleta base
      const [atletaResult] = await sequelize.query(
        `INSERT INTO atletas (nombre, primer_apellido, segundo_apellido, fecha_nacimiento, genero, telefono, correo_electronico, fecha_registro)
         VALUES (:nombre, :primer_apellido, :segundo_apellido, :fecha_nacimiento, :genero, :telefono, :correo_electronico, :fecha_registro)`,
        {
          replacements: {
            nombre: atleta.nombre || '',
            primer_apellido: atleta.primer_apellido || '',
            segundo_apellido: atleta.segundo_apellido || null,
            fecha_nacimiento: atleta.fecha_nacimiento,
            genero: atleta.genero,
            telefono: atleta.telefono || null,
            correo_electronico: atleta.correo_electronico || null,
            fecha_registro: atleta.fecha_registro || new Date(),
          },
          type: Sequelize.QueryTypes.INSERT,
        }
      );

      const atletaId = atletaResult;
      atletasInsertados++;
      console.log(`  ✔  Atleta insertado: "${atleta.nombre} ${atleta.primer_apellido}" → ID: ${atletaId}`);

      // [verde] 2. Insertar condiciones médicas
      for (const condicion of condiciones) {
        await sequelize.query(
          `INSERT INTO atleta_condiciones (atleta_id, condicion) VALUES (:atleta_id, :condicion)`,
          { replacements: { atleta_id: atletaId, condicion }, type: Sequelize.QueryTypes.INSERT }
        );
      }
      if (condiciones.length > 0) console.log(`     ↳ ${condiciones.length} condición(es) médica(s) registrada(s).`);

      // [verde] 3. Insertar dispositivos/ayudas
      for (const disp of dispositivos) {
        await sequelize.query(
          `INSERT INTO atleta_dispositivos (atleta_id, tipo, nombre) VALUES (:atleta_id, :tipo, :nombre)`,
          { replacements: { atleta_id: atletaId, tipo: disp.tipo, nombre: disp.nombre }, type: Sequelize.QueryTypes.INSERT }
        );
      }
      if (dispositivos.length > 0) console.log(`     ↳ ${dispositivos.length} dispositivo(s) registrado(s).`);

      // [verde] 4. Insertar medicamentos
      for (const med of medicamentos) {
        await sequelize.query(
          `INSERT INTO atleta_medicamentos (atleta_id, nombre, dosis, frecuencia) VALUES (:atleta_id, :nombre, :dosis, :frecuencia)`,
          { replacements: { atleta_id: atletaId, nombre: med.nombre, dosis: med.dosis, frecuencia: med.frecuencia }, type: Sequelize.QueryTypes.INSERT }
        );
      }
      if (medicamentos.length > 0) console.log(`     ↳ ${medicamentos.length} medicamento(s) registrado(s).`);

      // [verde] 5. Insertar alergias
      for (const alergia of alergias) {
        await sequelize.query(
          `INSERT INTO atleta_alergias (atleta_id, tipo_alergia) VALUES (:atleta_id, :tipo_alergia)`,
          { replacements: { atleta_id: atletaId, tipo_alergia: alergia }, type: Sequelize.QueryTypes.INSERT }
        );
      }
    }

    await sequelize.query(`SET FOREIGN_KEY_CHECKS = 1`);

    console.log(`\n${'='.repeat(55)}`);
    console.log(`✅ MIGRACIÓN COMPLETADA EXITOSAMENTE`);
    console.log(`   • Atletas migrados    : ${atletasInsertados}`);
    console.log(`${'='.repeat(55)}\n`);
    console.log('💡 NOTA: Los datos de Usuarios, Entrenadores, Voluntarios,');
    console.log('   Tutores y Competiciones deben ser migrados por los');
    console.log('   compañeros de equipo que trabajen esos módulos.\n');

  } catch (error) {
    console.error('\n❌ ERROR DURANTE LA MIGRACIÓN:');
    console.error(error.message);
    if (error.original) console.error('   Detalle SQL:', error.original.sqlMessage);
  } finally {
    await sequelize.close();
    console.log('🔒 Conexión a la base de datos cerrada.\n');
  }
}

// [verde] Ejecutar la migración
migrarDatos();
