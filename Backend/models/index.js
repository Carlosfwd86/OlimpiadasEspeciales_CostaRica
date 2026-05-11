const { sequelize } = require('../config/database');

// Aquí se importarán los modelos. Por ejemplo:
// const User = require('./user.model')(sequelize);

// Se definen las asociaciones aquí si es necesario
// User.hasMany(Post);

const db = {
  sequelize,
  // User,
};

module.exports = db;
