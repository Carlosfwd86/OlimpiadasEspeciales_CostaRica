const express = require('express');
const router = express.Router();
const nivelHabilidadController = require('../controllers/nivelHabilidadController');

const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

router.use(auth);

router.get('/', nivelHabilidadController.getAll);
router.get('/:id', nivelHabilidadController.getById);

// Solo Admin
router.post('/', checkRole([1]), nivelHabilidadController.create);
router.put('/:id', checkRole([1]), nivelHabilidadController.update);
router.delete('/:id', checkRole([1]), nivelHabilidadController.delete);

module.exports = router;
