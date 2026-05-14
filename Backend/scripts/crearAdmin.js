require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

async function crearAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos.');

    // Crear todas las tablas si no existen
    await sequelize.sync({ force: false });
    console.log('✅ Tablas sincronizadas.');

    // Crear rol Administrador con id=1 si no existe
    await sequelize.query(`
      INSERT IGNORE INTO roles (id, nombre, descripcion, created_at)
      VALUES (1, 'Administrador', 'Acceso total al sistema', NOW())
    `);

    const password = 'Admin123';
    const password_hash = await bcrypt.hash(password, 10);


    // Insertar admin o actualizar si ya existe
    await sequelize.query(`
      INSERT INTO usuarios
        (rol_id, nombre, apellido, cedula, correo_electronico, password_hash, status, fecha_registro, updated_at)
      VALUES
        (1, 'Admin', 'Principal', '000000000', 'admin@olimpiadas.cr', :hash, 'ACTIVO', NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        password_hash = :hash,
        status = 'ACTIVO'
    `, { replacements: { hash: password_hash } });

    console.log('\n🎉 Usuario administrador listo.');
    console.log('   Email:      admin@olimpiadas.cr');
    console.log('   Contraseña: Admin123\n');


    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

crearAdmin();
