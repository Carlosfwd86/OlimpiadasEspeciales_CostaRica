/**
 * Convierte contraseñas guardadas en texto plano a hash bcrypt.
 * Ejecutar: node scripts/fix-plain-passwords.js
 */
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'olimpiadas_db',
  });

  const [rows] = await conn.execute(
    'SELECT id, correo_electronico, password_hash FROM usuarios'
  );

  let fixed = 0;
  for (const u of rows) {
    const hash = u.password_hash || '';
    if (hash.startsWith('$2')) continue;

    const plain = hash;
    const newHash = await bcrypt.hash(plain, 10);
    await conn.execute(
      'UPDATE usuarios SET password_hash = ? WHERE id = ?',
      [newHash, u.id]
    );
    console.log(`✓ ${u.correo_electronico} → contraseña: "${plain}"`);
    fixed++;
  }

  await conn.end();
  console.log(`\nListo. ${fixed} usuario(s) actualizado(s).`);
})().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
