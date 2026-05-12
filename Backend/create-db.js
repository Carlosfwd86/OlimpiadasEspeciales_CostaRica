require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log(`Base de datos '${process.env.DB_NAME}' verificada/creada con éxito.`);
    await connection.end();
  } catch (error) {
    console.error('Error creando la base de datos:', error);
    process.exit(1);
  }
}

createDatabase();
