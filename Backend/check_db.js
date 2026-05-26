const { models, sequelize } = require('./config/database');
const { Usuario } = models;

async function checkUser() {
  try {
    const user = await Usuario.findOne({ where: { correo_electronico: 'admin@gmail.com' } });
    if (user) {
      console.log('User found:', user.toJSON());
    } else {
      console.log('User admin@gmail.com NOT found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}
checkUser();
