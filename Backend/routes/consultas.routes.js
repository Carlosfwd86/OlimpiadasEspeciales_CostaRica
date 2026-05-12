const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');

router.get('/', consultaController.getAll);
router.get('/:id', consultaController.getById);
router.post('/', consultaController.create);
router.put('/:id', consultaController.update);
router.delete('/:id', consultaController.delete);

module.exports = router;
