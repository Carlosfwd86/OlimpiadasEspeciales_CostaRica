const { sequelize } = require('../config/database');
const Competicion = require('./competicion.model');
const CompeticionAtleta = require('./competicion_atleta.model');
const Entrenador = require('./entrenador.model');
const Voluntario = require('./voluntario.model');
const VoluntarioArea = require('./voluntario_area.model');

// Definición de asociaciones entre modelos
// Relación N:M entre Atletas y Competiciones a través de la tabla pivote
// Nota: Se asume que el modelo Atleta existe externamente
Competicion.belongsToMany(sequelize.models.Atleta || {}, { 
  through: CompeticionAtleta,
  foreignKey: 'competicion_id',
  otherKey: 'atleta_id'
});

// Relación 1:N entre Voluntarios y sus Áreas de interés
Voluntario.hasMany(VoluntarioArea, {
  foreignKey: 'voluntario_id',
  onDelete: 'CASCADE'
});
VoluntarioArea.belongsTo(Voluntario, {
  foreignKey: 'voluntario_id'
});

const db = {
  sequelize,
  Competicion,
  CompeticionAtleta,
  Entrenador,
  Voluntario,
  VoluntarioArea
};

module.exports = db;
