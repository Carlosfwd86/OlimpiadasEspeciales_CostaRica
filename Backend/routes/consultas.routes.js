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

module.exports = router;
