const { models } = require('../config/database');
const { Atleta, Voluntario, Inscripcion, Consulta, Usuario, Competicion } = models;
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @module statsController
 * @description Controlador para proveer estadísticas y datos agregados para los dashboards y reportes.
 */

/**
 * @function getStats
 * @description Recupera conteos clave (atletas, voluntarios, inscripciones, tutores) y calcula métricas resumidas para mostrar en tarjetas estadísticas (StatCards).
 */
const getStats = async (req, res) => {
  try {
    const [totalAtletas, totalVoluntarios, totalInscripciones, totalConsultas, totalTutores] = await Promise.all([
      Atleta.count(),
      Voluntario.count(),
      Inscripcion.count({ where: { estado: 'PENDIENTE' } }),
      Consulta ? Consulta.count() : Promise.resolve(0),
      Usuario.count({ where: { rol_id: 5 } }) // 5 = tutor según el seeder
    ]);

    // Shape compatible con ServicesAdmin.ts -> getStats
    return res.status(200).json(successResponse({
      totalRegistros:       { valor: totalAtletas + totalInscripciones, porcentaje: '+12%', tendencia: 'up' },
      atletasActivos:       { valor: totalAtletas,      porcentaje: '+5%', tendencia: 'up' },
      revisionesPendientes: { valor: totalInscripciones, textoExtra: 'Inscripciones pendientes' },
      voluntarios:          { valor: totalVoluntarios,  porcentaje: '0%',  tendencia: 'none' },
      tutores:              { valor: totalTutores }
    }, 'Estadísticas obtenidas'));

  } catch (error) {
    console.error('Error al obtener summary:', error);
    return res.status(500).json(errorResponse('Error al calcular estadísticas', 500, error.message));
  }
};

/**
 * @function getCharts
 * @description Devuelve los datos estructurados (meses, género, etc.) necesarios para renderizar gráficos visuales en el frontend.
 */
  const getCharts = async (req, res) => {
  try {
    return res.status(200).json(successResponse({
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
    }, 'Gráficos obtenidos'));
  } catch (error) {
    return res.status(500).json(errorResponse('Error al obtener datos de gráficos', 500, error.message));
  }
};

module.exports = { getStats, getCharts };



