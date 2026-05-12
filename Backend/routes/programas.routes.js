const express = require('express');
const router = express.Router();
const programaController = require('../controllers/programaController');

const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

router.use(auth);

router.get('/', programaController.getAll);
router.get('/:id', programaController.getById);

// Solo Admin
router.post('/', checkRole([1]), programaController.create);
router.put('/:id', checkRole([1]), programaController.update);
router.delete('/:id', checkRole([1]), programaController.delete);

module.exports = router;
