const { sequelize } = require('../config/database');

const Usuario = require('./Usuario')(sequelize);
const Atleta = require('./Atleta')(sequelize);
const Tutor = require('./Tutor')(sequelize);
const Disciplina = require('./Disciplina')(sequelize);
const Programa = require('./Programa')(sequelize);
const NivelHabilidad = require('./NivelHabilidad')(sequelize);
const Inscripcion = require('./Inscripcion')(sequelize);
const Consulta = require('./Consulta')(sequelize);

// Asociaciones Tutor - Usuario
Usuario.hasOne(Tutor, { foreignKey: 'usuario_id' });
Tutor.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Asociaciones Inscripcion
Atleta.hasMany(Inscripcion, { foreignKey: 'atleta_id' });
Inscripcion.belongsTo(Atleta, { foreignKey: 'atleta_id' });

Disciplina.hasMany(Inscripcion, { foreignKey: 'disciplina_id' });
Inscripcion.belongsTo(Disciplina, { foreignKey: 'disciplina_id' });

Programa.hasMany(Inscripcion, { foreignKey: 'programa_id' });
Inscripcion.belongsTo(Programa, { foreignKey: 'programa_id' });

NivelHabilidad.hasMany(Inscripcion, { foreignKey: 'nivel_id' });
Inscripcion.belongsTo(NivelHabilidad, { foreignKey: 'nivel_id' });

// Asociaciones Consulta - Usuario
Usuario.hasMany(Consulta, { foreignKey: 'usuario_id' });
Consulta.belongsTo(Usuario, { foreignKey: 'usuario_id' });

const db = {
  sequelize,
  Usuario,
  Atleta,
  Tutor,
  Disciplina,
  Programa,
  NivelHabilidad,
  Inscripcion,
  Consulta
};

module.exports = db;
