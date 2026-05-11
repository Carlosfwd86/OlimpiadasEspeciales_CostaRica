'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tutores', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      usuario_id: { type: Sequelize.INTEGER, unique: true, allowNull: true, references: { model: 'usuarios', key: 'id' } },
      nombre: { type: Sequelize.STRING(100), allowNull: false },
      apellido: { type: Sequelize.STRING(100), allowNull: false },
      cedula: { type: Sequelize.STRING(20), unique: true, allowNull: true },
      telefono: { type: Sequelize.STRING(15), allowNull: true },
      correo_electronico: { type: Sequelize.STRING(150), allowNull: true },
      direccion: { type: Sequelize.TEXT, allowNull: true },
      pais: { type: Sequelize.STRING(50), allowNull: true },
      relacion_con_atleta: { type: Sequelize.STRING(50), allowNull: true },
      experiencia_necesidades_especiales: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
      status: { type: Sequelize.ENUM('ACTIVO', 'INACTIVO'), defaultValue: 'ACTIVO', allowNull: false },
      fecha_registro: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.sequelize.query(`ALTER TABLE tutores ADD CONSTRAINT chk_tutores_correo CHECK (correo_electronico IS NULL OR correo_electronico REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}$')`);
    await queryInterface.sequelize.query(`ALTER TABLE tutores ADD CONSTRAINT chk_tutores_cedula CHECK (cedula IS NULL OR cedula REGEXP '^[a-zA-Z0-9\\\\-]+$')`);
    await queryInterface.sequelize.query(`ALTER TABLE tutores ADD CONSTRAINT chk_tutores_telefono CHECK (telefono IS NULL OR telefono REGEXP '^[0-9+\\\\-\\\\s]+$')`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tutores');
  }
};
