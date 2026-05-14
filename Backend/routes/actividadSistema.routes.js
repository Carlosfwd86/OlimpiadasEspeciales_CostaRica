const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { models } = require('../config/database');
const { ActividadSistema } = models;

const MAX_ENTRIES = 50;

/**
 * GET /api/actividad-sistema
 * Retorna el log de actividad en orden cronológico inverso (más reciente primero).
 */
router.get('/', auth, async (req, res) => {
  try {
    const registros = await ActividadSistema.findAll({
      order: [['time', 'DESC']],
      limit: MAX_ENTRIES
    });
    return res.status(200).json(registros);
  } catch (error) {
    console.error('Error al obtener actividad del sistema:', error);
    return res.status(500).json({ error: 'Error al obtener el log de actividad.' });
  }
});

/**
 * POST /api/actividad-sistema
 * Registra una nueva entrada de actividad.
 * Body: { title, details, icon?, iconColor?, time? }
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, details, icon = 'fa-solid fa-circle-info', iconColor = 'blue', time } = req.body;

    if (!title || !details) {
      return res.status(400).json({ error: 'Los campos title y details son obligatorios.' });
    }

    const entrada = await ActividadSistema.create({
      title,
      details,
      icon,
      icon_color: iconColor,
      time: time ? new Date(time) : new Date()
    });

    return res.status(201).json(entrada);
  } catch (error) {
    console.error('Error al registrar actividad del sistema:', error);
    return res.status(500).json({ error: 'Error al registrar la actividad.' });
  }
});

module.exports = router;
