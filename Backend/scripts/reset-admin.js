const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

(async () => {
  try {
    const password = 'Admin1234!';
    const hash = bcrypt.hashSync(password, 10);

    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '1234',
      database: 'olimpiadas_db'
    });

    const [rows] = await conn.execute(
      'SELECT id FROM usuarios WHERE correo_electronico = ?',
      ['admin@olimpiadas.cr']
    );

    if (rows.length > 0) {
      await conn.execute(
        'UPDATE usuarios SET password_hash = ?, status = ? WHERE correo_electronico = ?',
        [hash, 'ACTIVO', 'admin@olimpiadas.cr']
      );
      console.log('✅ Admin ACTUALIZADO correctamente.');
    } else {
      await conn.execute(
        `INSERT INTO usuarios (rol_id, nombre, apellido, cedula, correo_electronico, password_hash, status, fecha_registro, updated_at)
         VALUES (1, 'Admin', 'Principal', '000000000', 'admin@olimpiadas.cr', ?, 'ACTIVO', NOW(), NOW())`,
        [hash]
      );
      console.log('✅ Admin CREADO correctamente.');
    }

    await conn.end();
    console.log('');
    console.log('🔑 CREDENCIALES DE ACCESO:');
    console.log('   Email:    admin@olimpiadas.cr');
    console.log('   Password: Admin1234!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
