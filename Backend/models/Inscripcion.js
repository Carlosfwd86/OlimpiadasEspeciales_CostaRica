const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Inscripcion = sequelize.define('Inscripcion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    atleta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'atletas',
        key: 'id'
      }
    },
    disciplina_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'disciplinas',
        key: 'id'
      }
    },
    programa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'programas',
        key: 'id'
      }
    },
    nivel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'niveles_habilidad',
        key: 'id'
      }
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA'),
      defaultValue: 'PENDIENTE',
      allowNull: false
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_aprobacion: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'inscripciones',
    timestamps: true,
    createdAt: 'fecha_inscripcion',
    updatedAt: 'updated_at'
  });
  return Inscripcion;
};
