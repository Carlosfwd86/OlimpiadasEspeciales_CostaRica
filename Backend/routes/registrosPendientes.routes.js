const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const { models } = require('../config/database');
const { Inscripcion, Atleta } = models;

/**
 * GET /api/registros-pendientes
 * Devuelve inscripciones con status PENDIENTE para el panel de administración
 * y para el botón "Exportar" de Panel-Administrativo.
 */
router.get('/', auth, checkRole([1]), async (req, res) => {
  try {
    const registros = await Inscripcion.findAll({
      where: { estado: 'PENDIENTE' },
      include: [{ model: Atleta, as: 'atleta', required: false }],
      order: [['created_at', 'DESC']]
    });

    // Mapear al shape que el frontend espera para el CSV export
    const data = registros.map(r => ({
      id:     r.id,
      name:   r.atleta ? `${r.atleta.nombre} ${r.atleta.apellido}` : 'N/A',
      email:  r.atleta ? r.atleta.correo_electronico : 'N/A',
      phone:  r.atleta ? r.atleta.telefono : '',
      sport:  r.disciplina || '',
      region: r.atleta ? r.atleta.region : '',
      status: r.estado
    }));

    return res.status(200).json({
      data,
      message: 'OK',
      status: 200
    });
  } catch (error) {
    console.error('Error al obtener registros pendientes:', error);
    return res.status(500).json({ error: 'Error al obtener los registros pendientes.' });
  }
});

module.exports = router;
