const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const { models } = require('../config/database');
const { RegistroPendiente } = models;

/**
 * GET /api/registros-pendientes
 * Devuelve registros pendientes de aprobación (Atletas, Voluntarios, etc.)
 */
router.get('/', auth, checkRole([1]), async (req, res) => {
  try {
    const registros = await RegistroPendiente.findAll({
      where: { estado: 'PENDIENTE' },
      order: [['fecha_registro', 'DESC']]
    });

    const data = registros.map(r => {
      const payload = r.datos || {};
      const fullName = payload.nombre + (payload.apellido ? ` ${payload.apellido}` : '');
      const initials = payload.nombre ? (payload.nombre.charAt(0) + (payload.apellido ? payload.apellido.charAt(0) : '')).toUpperCase() : '??';
      const timeAgo = new Date(r.fecha_registro).toLocaleDateString();
      
      const colors = ['blue', 'red', 'green', 'orange', 'purple', 'yellow'];
      const bgColor = colors[r.id % colors.length];

      return {
        id:          r.id,
        name:        fullName || 'N/A',
        email:       r.correo_electronico || payload.correoElectronico || 'N/A',
        phone:       payload.telefono || '',
        sport:       payload.disciplina || payload.disciplinaPrincipal || 'N/A',
        region:      payload.pais || 'Nacional',
        status:      r.estado,
        statusColor: 'orange',
        bgColor:     `bg-${bgColor}`,
        initials:    initials,
        time:        timeAgo,
        rol:         r.rol,
        datos:       payload // Se envían los datos completos para poder ver el detalle
      };
    });

    return res.status(200).json({ data, message: 'OK', status: 200 });

  } catch (error) {
    console.error('Error al obtener registros pendientes:', error);
    return res.status(500).json({ error: 'Error al obtener los registros pendientes.' });
  }
});

router.post('/', async (req, res) => { // Removido auth y checkRole porque un visitante no logueado debe poder registrarse
  try {
    const registro = req.body;
    
    // Guardar el payload entero
    const nuevoRegistro = await RegistroPendiente.create({
      usuario_id: registro.usuarioId || null,
      rol: registro.rol || 'atleta',
      correo_electronico: registro.correoElectronico || registro.email || null,
      datos: registro,
      estado: 'PENDIENTE'
    });

    return res.status(201).json({ data: nuevoRegistro, message: 'Creado', status: 201 });
  } catch (error) {
    console.error('Error en POST /registros-pendientes:', error);
    return res.status(500).json({ error: 'Error al crear registro pendiente.' });
  }
});

router.patch('/:id', auth, checkRole([1]), async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await RegistroPendiente.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ error: 'Registro no encontrado.' });
    const data = await RegistroPendiente.findByPk(id);
    return res.status(200).json({ data, message: 'OK', status: 200 });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar registro.' });
  }
});

router.delete('/:id', auth, checkRole([1]), async (req, res) => {
  try {
    const { id } = req.params;
    await RegistroPendiente.destroy({ where: { id } });
    return res.status(200).json({ message: 'Eliminado', status: 200 });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar registro.' });
  }
});

module.exports = router;
