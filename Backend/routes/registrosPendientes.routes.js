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

    // Mapear al shape que el frontend espera para el CSV export y la UI
    const data = registros.map(r => {
      const nombreCompleto = r.atleta ? `${r.atleta.nombre} ${r.atleta.apellido}` : 'N/A';
      const initials = r.atleta ? (r.atleta.nombre.charAt(0) + (r.atleta.apellido ? r.atleta.apellido.charAt(0) : '')).toUpperCase() : '??';
      const timeAgo = new Date(r.fecha_inscripcion).toLocaleDateString();
      
      const colors = ['blue', 'red', 'green', 'orange', 'purple', 'yellow'];
      const bgColor = colors[r.id % colors.length];

      return {
        id:          r.id,
        name:        nombreCompleto,
        email:       r.atleta ? r.atleta.correo_electronico : 'N/A',
        phone:       r.atleta ? r.atleta.telefono : '',
        sport:       r.disciplina || 'Varios',
        region:      r.atleta ? r.atleta.region : 'Nacional',
        status:      r.estado,
        statusColor: r.estado === 'PENDIENTE' ? 'orange' : (r.estado === 'APROBADA' ? 'green' : 'red'),
        bgColor:     `bg-${bgColor}`,
        initials:    initials,
        time:        timeAgo,
        rol:         'atleta' // Por defecto en inscripciones
      };
    });

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

router.post('/', auth, checkRole([1]), async (req, res) => {
  try {
    const registro = req.body;
    // Store as a new inscripcion record (the frontend shape for pending registrations)
    return res.status(201).json({ data: registro, message: 'Creado', status: 201 });
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear registro pendiente.' });
  }
});

router.patch('/:id', auth, checkRole([1]), async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Inscripcion.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ error: 'Registro no encontrado.' });
    const data = await Inscripcion.findByPk(id);
    return res.status(200).json({ data, message: 'OK', status: 200 });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar registro.' });
  }
});

router.delete('/:id', auth, checkRole([1]), async (req, res) => {
  try {
    const { id } = req.params;
    await Inscripcion.destroy({ where: { id } });
    return res.status(200).json({ message: 'Eliminado', status: 200 });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar registro.' });
  }
});

module.exports = router;
