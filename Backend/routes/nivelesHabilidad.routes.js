const express = require('express');
const router = express.Router();
const nivelHabilidadController = require('../controllers/nivelHabilidadController');

router.get('/', nivelHabilidadController.getAll);
router.get('/:id', nivelHabilidadController.getById);
router.post('/', nivelHabilidadController.create);
router.put('/:id', nivelHabilidadController.update);
router.delete('/:id', nivelHabilidadController.delete);

module.exports = router;
