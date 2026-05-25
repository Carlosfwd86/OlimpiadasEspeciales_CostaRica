/**
 * Crea un atleta de prueba + usuario vinculado para probar el panel admin.
 * Uso: node scripts/crearAtletaPrueba.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const Atleta = require('../models/Atleta');
const AtletaCondicion = require('../models/AtletaCondicion');
const AtletaAlergia = require('../models/AtletaAlergia');
const AtletaMedicamento = require('../models/AtletaMedicamento');
const { Usuario } = require('../config/database').models;

const CORREO_ATLETA = 'atleta.prueba@olimpiadas.cr';
const PASSWORD = 'Atleta123!';

const datosPrueba = {
  usuario: {
    rol_id: 2,
    nombre: 'Juan Carlos',
    apellido: 'Mora Solís',
    cedula: '1-0999-0888',
    correo_electronico: CORREO_ATLETA,
    telefono: '+506 8888-1234',
    direccion: 'Barrio Escalante, San José, Costa Rica',
    pais: 'Costa Rica',
    fecha_nacimiento: '2010-05-15',
    genero: 'Masculino',
    status: 'ACTIVO'
  },
  atleta: {
    nombre: 'Juan Carlos',
    primer_apellido: 'Mora',
    segundo_apellido: 'Solís',
    fecha_nacimiento: '2010-05-15',
    genero: 'Masculino',
    telefono: '+506 8888-1234',
    correo_electronico: CORREO_ATLETA,
    cedula: '1-0999-0888',
    pais: 'Costa Rica',
    direccion: 'Barrio Escalante, San José, Costa Rica',
    emergencia_nombre: 'María Mora',
    emergencia_telefono: '+506 7777-9999',
    programa_id: 1,
    nivel_habilidad_id: 2,
    equipo: 'Equipo San José',
    experiencia: '3 años en atletismo adaptado'
  },
  condiciones: ['Asma leve'],
  medicamentos: [{ nombre: 'Salbutamol', dosis: '2 inhalaciones', frecuencia: 'Según necesidad' }],
  alergias: [{ tipo_alergia: 'Polen', especificacion: 'Estacional' }]
};

async function crearAtletaPrueba() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos OK\n');

    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    let usuario = await Usuario.findOne({ where: { correo_electronico: CORREO_ATLETA } });

    if (usuario) {
      await usuario.update({ ...datosPrueba.usuario, password_hash: passwordHash });
      console.log('ℹ️  Usuario de prueba actualizado.');
    } else {
      usuario = await Usuario.create({
        ...datosPrueba.usuario,
        password_hash: passwordHash
      });
      console.log('✅ Usuario atleta creado.');
    }

    let atleta = await Atleta.findOne({ where: { correo_electronico: CORREO_ATLETA } });

    if (atleta) {
      await atleta.update(datosPrueba.atleta);
      console.log('ℹ️  Registro de atleta actualizado.');
    } else {
      atleta = await Atleta.create({
        ...datosPrueba.atleta,
        fecha_registro: new Date()
      });
      console.log('✅ Atleta creado en tabla atletas.');
    }

    await AtletaCondicion.destroy({ where: { atleta_id: atleta.id } });
    for (const condicion of datosPrueba.condiciones) {
      await AtletaCondicion.create({ atleta_id: atleta.id, condicion });
    }

    await AtletaAlergia.destroy({ where: { atleta_id: atleta.id } });
    for (const alergia of datosPrueba.alergias) {
      await AtletaAlergia.create({ atleta_id: atleta.id, ...alergia });
    }

    await AtletaMedicamento.destroy({ where: { atleta_id: atleta.id } });
    for (const med of datosPrueba.medicamentos) {
      await AtletaMedicamento.create({
        atleta_id: atleta.id,
        ...med
      });
    }

    console.log('\n🎉 Atleta de prueba listo para el panel admin\n');
    console.log('── Credenciales (login como atleta) ──');
    console.log(`   Correo:     ${CORREO_ATLETA}`);
    console.log(`   Contraseña: ${PASSWORD}`);
    console.log(`   Rol:        Atleta (rol_id = 2)\n`);
    console.log('── Datos en dashboard ──');
    console.log(`   ID atleta:  ${atleta.id}`);
    console.log(`   Nombre:     ${atleta.nombre} ${atleta.primer_apellido} ${atleta.segundo_apellido || ''}`);
    console.log(`   Programa:   San José (id programa: 1)`);
    console.log(`   Región mapa: San José (vía dirección)\n`);
    console.log('Inicia sesión como admin (admin@gmail.com / admin123) y revisa:');
    console.log('  • Tab Atletas');
    console.log('  • Gráficos / Regiones');
    console.log('  • Detalle con análisis IA (id atleta:', atleta.id, ')\n');

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.parent) console.error(err.parent.sqlMessage || err.parent);
    process.exit(1);
  }
}

crearAtletaPrueba();
