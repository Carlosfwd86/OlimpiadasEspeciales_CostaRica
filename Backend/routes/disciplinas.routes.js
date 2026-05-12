const express = require('express');
const router = express.Router();
const disciplinaController = require('../controllers/disciplinaController');

const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

router.use(auth);

router.get('/', disciplinaController.getAll);
router.get('/:id', disciplinaController.getById);

// Solo Admin
router.post('/', checkRole([1]), disciplinaController.create);
router.put('/:id', checkRole([1]), disciplinaController.update);
router.delete('/:id', checkRole([1]), disciplinaController.delete);

module.exports = router;
