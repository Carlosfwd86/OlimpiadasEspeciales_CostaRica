const { models } = require('../config/database');
const { Voluntario, Atleta, Consulta } = models;
const { OpenAI } = require('openai');

// Función de scoring de confianza (sin costo de API - reglas determinísticas)
const calcularConfianza = (registro) => {
    let score = 100;
    const observaciones = [];

    // Validar nombre (nombres muy cortos o con números son sospechosos)
    const nombre = `${registro.nombre || ''} ${registro.apellido || ''}`.trim();
    if (nombre.length < 5) { score -= 30; observaciones.push('Nombre muy corto'); }
    if (/\d/.test(nombre)) { score -= 25; observaciones.push('Números en el nombre'); }
    if (/test|prueba|asdf|qwerty/i.test(nombre)) { score -= 50; observaciones.push('Nombre de prueba detectado'); }

    // Validar correo
    const correo = registro.correo_electronico || '';
    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { score -= 20; observaciones.push('Correo inválido o faltante'); }
    if (/test|prueba|example\.com|mailinator/i.test(correo)) { score -= 40; observaciones.push('Correo temporal detectado'); }

    // Validar teléfono (Costa Rica: 8 dígitos)
    const telefono = registro.telefono || '';
    if (!/^[2-9]\d{7}$/.test(telefono.replace(/[\s\-]/g, ''))) { score -= 15; observaciones.push('Teléfono fuera del formato CR'); }

    score = Math.max(0, score);
    let nivel, color;
    if (score >= 80) { nivel = 'Alto'; color = 'green'; }
    else if (score >= 50) { nivel = 'Medio'; color = 'orange'; }
    else { nivel = 'Bajo'; color = 'red'; }

    return { score, nivel, color, observaciones };
};

const adminController = {
  getRegistrosPendientes: async (req, res) => {
    try {
      const voluntarios = await Voluntario.findAll({ where: { status: 'PENDIENTE' } });
      
      const registros = voluntarios.map(v => {
        const confianza = calcularConfianza(v);
        return {
          id: v.id,
          name: `${v.nombre} ${v.apellido}`,
          email: v.correo_electronico,
          phone: v.telefono,
          sport: 'Voluntariado',
          region: 'Nacional',
          status: 'PENDIENTE',
          rol: 'voluntario',
          statusColor: 'yellow',
          bgColor: 'bg-light-yellow',
          initials: v.nombre.charAt(0) + v.apellido.charAt(0),
          time: 'Reciente',
          // Auditoría IA (scoring determinístico)
          auditoria: {
            score: confianza.score,
            nivel: confianza.nivel,
            color: confianza.color,
            observaciones: confianza.observaciones
          }
        };
      });

      return res.status(200).json(registros);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

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
