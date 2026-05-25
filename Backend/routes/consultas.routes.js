const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');

const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validationMiddleware');
const validators = require('../utils/validators');

// Obtener mensajes (Solo Admin)
router.get('/', auth, checkRole([1]), consultaController.getAll);
router.get('/:id', auth, checkRole([1]), consultaController.getById);

// Enviar mensaje (Público, pero con validación estricta y saneamiento XSS)
router.post('/', validators.consulta, validate, consultaController.create);

// Gestión (Solo Admin)
router.put('/:id', auth, checkRole([1]), validators.consulta, validate, consultaController.update);
router.delete('/:id', auth, checkRole([1]), consultaController.delete);

// Copiloto IA: genera borrador de respuesta institucional (Solo Admin)
router.post('/:id/sugerirRespuesta', auth, checkRole([1]), consultaController.sugerirRespuesta);

// IA + envío automático a un solo remitente (Solo Admin)
router.post('/:id/responder-automatico', auth, checkRole([1]), consultaController.responderAutomatico);

// Enviar respuesta masiva a varios correos (Solo Admin)
router.post('/responder-masivo', auth, checkRole([1]), consultaController.responderMasivo);

// IA + envío a todas las consultas pendientes de una vez (Solo Admin)
router.post('/responder-pendientes', auth, checkRole([1]), consultaController.responderTodasPendientes);

// Enviar respuesta real por correo directamente (Solo Admin)
router.post('/:id/responder', auth, checkRole([1]), consultaController.responderConsulta);

module.exports = router;
