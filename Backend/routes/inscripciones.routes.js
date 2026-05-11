const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionController');

router.get('/', inscripcionController.getAll);
router.get('/:id', inscripcionController.getById);
router.post('/', inscripcionController.create);
router.put('/:id', inscripcionController.update);
router.delete('/:id', inscripcionController.delete);

module.exports = router;
