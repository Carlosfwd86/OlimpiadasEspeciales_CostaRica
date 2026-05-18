const { models } = require('../config/database');
const { Voluntario, Atleta, Consulta } = models;

/**
 * @module adminController
 * @description Controlador para el panel de administración. Provee métricas y registros de estado.
 */
const adminController = {
  /**
   * @function getRegistrosPendientes
   * @description Obtiene los registros de voluntarios en estado "PENDIENTE" y los adapta al formato visual requerido por el frontend.
   */
  getRegistrosPendientes: async (req, res) => {
    try {
      // Por ahora, obtenemos voluntarios pendientes como ejemplo de registros pendientes
      const voluntarios = await Voluntario.findAll({ where: { status: 'PENDIENTE' } });
      
      // Mapeamos al formato 'Registro' que espera el frontend
      const registros = voluntarios.map(v => ({
        id: v.id,
        name: `${v.nombre} ${v.apellido}`,
        email: v.correo_electronico,
        phone: v.telefono,
        sport: 'Voluntariado', // O el área si la tuviéramos
        region: 'Nacional',
        status: 'PENDIENTE',
        rol: 'voluntario',
        statusColor: 'yellow',
        bgColor: 'bg-light-yellow',
        initials: v.nombre.charAt(0) + v.apellido.charAt(0),
        time: 'Reciente'
      }));

      return res.status(200).json(registros);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * @function getStats
   * @description Calcula métricas clave (total de atletas, voluntarios, registros pendientes) para el dashboard del administrador.
   */
  getStats: async (req, res) => {
    try {
      const totalAtletas = await Atleta.count();
      const totalVoluntarios = await Voluntario.count();
      const pendientes = await Voluntario.count({ where: { status: 'PENDIENTE' } });

      return res.status(200).json({
        totalRegistros: { valor: totalAtletas + totalVoluntarios, porcentaje: "+10%", tendencia: "up" },
        atletasActivos: { valor: totalAtletas, porcentaje: "+5%", tendencia: "up" },
        revisionesPendientes: { valor: pendientes, textoExtra: "Pendientes de revisión" },
        voluntarios: { valor: totalVoluntarios, porcentaje: "+2%", tendencia: "up" }
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * @function getGraficos
   * @description Devuelve datos estáticos estructurados (crecimiento, distribución) para renderizar gráficos en el frontend del admin.
   */
  getGraficos: async (req, res) => {
    // Datos dummy para que el frontend no rompa, pero servidos desde el backend
    return res.status(200).json({
      crecimiento: [
        { mes: 'Ene', valor: 400 },
        { mes: 'Feb', valor: 600 },
        { mes: 'Mar', valor: 800 },
        { mes: 'Abr', valor: 1000 }
      ],
      distribucion: [
        { label: 'Atletas', valor: 60 },
        { label: 'Voluntarios', valor: 30 },
        { label: 'Tutores', valor: 10 }
      ]
    });
  }
};

module.exports = adminController;
