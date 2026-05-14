const { models } = require('../config/database');
const { Atleta, Voluntario, Inscripcion, Consulta, Usuario, Competicion } = models;

/**
 * GET /api/stats/summary
 * Retorna el resumen para los StatCards.
 */
const getStats = async (req, res) => {
  try {
    const [totalAtletas, totalVoluntarios, totalInscripciones, totalConsultas, totalTutores] = await Promise.all([
      Atleta.count(),
      Voluntario.count(),
      Inscripcion.count({ where: { estado: 'PENDIENTE' } }),
      Consulta ? Consulta.count() : Promise.resolve(0),
<<<<<<< HEAD
      Usuario.count({ where: { rol_id: 5 } }) // 5 = tutor según el seeder
=======
      Usuario.count({ where: { rol_id: 5 } }) // 5 = tutor
>>>>>>> fee5eac2d797c178cd8547ee18f585e0aa154dd0
    ]);

    // Shape compatible con ServicesAdmin.ts -> getStats
    return res.status(200).json({
      data: {
        totalRegistros:       { valor: totalAtletas + totalInscripciones, porcentaje: '+12%', tendencia: 'up' },
        atletasActivos:       { valor: totalAtletas,      porcentaje: '+5%', tendencia: 'up' },
        revisionesPendientes: { valor: totalInscripciones, textoExtra: 'Inscripciones pendientes' },
        voluntarios:          { valor: totalVoluntarios,  porcentaje: '0%',  tendencia: 'none' },
        tutores:              { valor: totalTutores }
      },
      message: 'OK',
      status: 200
    });

  } catch (error) {
    console.error('Error al obtener summary:', error);
    return res.status(500).json({ error: 'Error al calcular estadísticas.' });
  }
};

/**
 * GET /api/stats/charts
 * Datos para los gráficos del dashboard.
 */
const getCharts = async (req, res) => {
  try {
    return res.status(200).json({
      registrosPorMes: [
        { name: 'Ene', value: 400 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 600 },
        { name: 'Abr', value: 800 },
        { name: 'May', value: 500 }
      ],
      distribucionAtletas: [
        { name: 'Masculino', value: 45 },
        { name: 'Femenino', value: 40 },
        { name: 'Otro', value: 15 }
      ]
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener datos de gráficos.' });
  }
};

module.exports = { getStats, getCharts };



