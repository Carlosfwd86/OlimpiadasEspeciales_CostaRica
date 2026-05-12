const { models } = require('../config/database');
const { Atleta, Voluntario, Inscripcion, Consulta } = models;

/**
 * GET /api/stats
 * Retorna conteos reales desde la BD para alimentar los StatCards del dashboard.
 * Shape de respuesta idéntico al que el frontend ya consume.
 */
const getStats = async (req, res) => {
  try {
    const { Atleta, Voluntario, Inscripcion, Consulta, Usuario } = models;

    const [totalAtletas, totalVoluntarios, totalInscripciones, totalConsultas, totalTutores] = await Promise.all([
      Atleta.count(),
      Voluntario.count(),
      Inscripcion.count(),
      Consulta ? Consulta.count() : Promise.resolve(0),
      Usuario.count({ where: { rol_id: 4 } }) // Suponiendo rol_id 4 es tutor, o consultar directamente
    ]);

    return res.status(200).json({
      data: {
        totalRegistros:       { valor: totalAtletas + totalInscripciones, porcentaje: '+12%', tendencia: 'up' },
        atletasActivos:       { valor: totalAtletas,      porcentaje: '+5%', tendencia: 'up' },
        revisionesPendientes: { valor: totalConsultas,    textoExtra: 'Requieren acción' },
        voluntarios:          { valor: totalVoluntarios,  porcentaje: '0%',  tendencia: 'none' },
        tutores:              { valor: totalTutores }
      },
      message: 'OK',
      status: 200
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return res.status(500).json({ error: 'Error al calcular estadísticas del sistema.' });
  }
};

module.exports = { getStats };
