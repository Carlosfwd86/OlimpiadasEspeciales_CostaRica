const { models } = require('../config/database');
const { Atleta, Voluntario, Inscripcion, Consulta, Usuario, Programa } = models;
const { successResponse, errorResponse } = require('../utils/apiResponse');

const PROVINCIAS = ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'];
const SPORT_FILL = ['fill-red', 'fill-blue', 'fill-green', 'fill-yellow'];

const normalizeKey = (text) =>
  String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');

const resolveProvincia = (atleta) => {
  const programa = atleta.programa;
  if (programa?.provincia) {
    const p = PROVINCIAS.find(
      (x) => x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') ===
        programa.provincia.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );
    if (p) return p;
  }
  if (programa?.nombre) {
    const match = PROVINCIAS.find(
      (x) =>
        x.toLowerCase() === programa.nombre.toLowerCase() ||
        programa.nombre.toLowerCase().includes(x.toLowerCase())
    );
    if (match) return match;
  }
  const direccion = atleta.direccion || '';
  for (const prov of PROVINCIAS) {
    if (direccion.toLowerCase().includes(prov.toLowerCase())) return prov;
  }
  return 'Desconocido';
};

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
      Usuario.count({ where: { rol_id: 5 } })
    ]);

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
 * @description Devuelve datos agregados para gráficos del panel admin (deportes y regiones).
 */
const getCharts = async (req, res) => {
  try {
    const atletas = await Atleta.findAll({
      attributes: ['id', 'equipo', 'direccion', 'genero', 'programa_id'],
      include: [{ model: Programa, as: 'programa', attributes: ['nombre', 'provincia'] }]
    });

    const total = atletas.length;
    const deporteCounts = {};
    const regionCounts = {};

    atletas.forEach((a) => {
      const deporte = (a.equipo && String(a.equipo).trim()) || 'Sin deporte asignado';
      deporteCounts[deporte] = (deporteCounts[deporte] || 0) + 1;

      const region = resolveProvincia(a);
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });

    const atletasPorDeporte = Object.entries(deporteCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([deporte, valor], index) => ({
        deporte,
        valor,
        porcentaje: total ? Math.round((valor / total) * 100) : 0,
        colorClase: SPORT_FILL[index % SPORT_FILL.length]
      }));

    const distribucionRegional = Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([region, valor]) => ({
        region,
        valor,
        colorClase: `color-${normalizeKey(region)}`
      }));

    const generoCounts = { Masculino: 0, Femenino: 0, Otro: 0 };
    atletas.forEach((a) => {
      if (generoCounts[a.genero] !== undefined) generoCounts[a.genero]++;
    });

    return res.status(200).json(successResponse({
      atletasPorDeporte,
      distribucionRegional,
      totalGeneral: total,
      distribucionAtletas: Object.entries(generoCounts).map(([name, value]) => ({ name, value })),
      registrosPorMes: []
    }, 'Gráficos obtenidos'));
  } catch (error) {
    console.error('Error al obtener gráficos:', error);
    return res.status(500).json(errorResponse('Error al obtener datos de gráficos', 500, error.message));
  }
};

module.exports = { getStats, getCharts };
