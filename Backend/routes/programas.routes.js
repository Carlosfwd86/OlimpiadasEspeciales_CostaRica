const express = require('express');
const router = express.Router();
const programaController = require('../controllers/programaController');

router.get('/', programaController.getAll);
router.get('/:id', programaController.getById);
router.post('/', programaController.create);
router.put('/:id', programaController.update);
router.delete('/:id', programaController.delete);

module.exports = router;
