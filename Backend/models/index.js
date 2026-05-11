const { sequelize } = require('../config/database');

// [verde] Importación de modelos del módulo de Atletas
const Atleta = require('./Atleta');
const AtletaDocumento = require('./AtletaDocumento');
const AtletaMedicamento = require('./AtletaMedicamento');
const AtletaCondicion = require('./AtletaCondicion');
const AtletaDispositivo = require('./AtletaDispositivo');
const AtletaAlergia = require('./AtletaAlergia');

// [verde] Definición de asociaciones (Relaciones 1:N)
Atleta.hasMany(AtletaDocumento, { foreignKey: 'atleta_id', as: 'documentos' });
AtletaDocumento.belongsTo(Atleta, { foreignKey: 'atleta_id' });

Atleta.hasMany(AtletaMedicamento, { foreignKey: 'atleta_id', as: 'medicamentos' });
AtletaMedicamento.belongsTo(Atleta, { foreignKey: 'atleta_id' });

Atleta.hasMany(AtletaCondicion, { foreignKey: 'atleta_id', as: 'condiciones' });
AtletaCondicion.belongsTo(Atleta, { foreignKey: 'atleta_id' });

Atleta.hasMany(AtletaDispositivo, { foreignKey: 'atleta_id', as: 'dispositivos' });
AtletaDispositivo.belongsTo(Atleta, { foreignKey: 'atleta_id' });

Atleta.hasMany(AtletaAlergia, { foreignKey: 'atleta_id', as: 'alergias' });
AtletaAlergia.belongsTo(Atleta, { foreignKey: 'atleta_id' });

const db = {
  sequelize,
  Atleta,
  AtletaDocumento,
  AtletaMedicamento,
  AtletaCondicion,
  AtletaDispositivo,
  AtletaAlergia
};

module.exports = db;

