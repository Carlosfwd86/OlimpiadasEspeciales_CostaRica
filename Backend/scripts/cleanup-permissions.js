const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || process.env.DB_PASS || '1234',
      database: process.env.DB_NAME || 'olimpiadas_db'
    });

    console.log('🧹 Limpiando tablas de permisos de la base de datos...');
    
    // Desactivar checks de FK temporalmente para borrar con seguridad
    await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
    
    await conn.execute('DROP TABLE IF EXISTS rol_permisos');
    console.log('✅ Tabla rol_permisos eliminada.');
    
    await conn.execute('DROP TABLE IF EXISTS permisos');
    console.log('✅ Tabla permisos eliminada.');
    
    await conn.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    await conn.end();
    console.log('✨ Limpieza de base de datos completada.');
  } catch (err) {
    console.error('❌ Error durante la limpieza:', err.message);
    process.exit(1);
  }
})();
