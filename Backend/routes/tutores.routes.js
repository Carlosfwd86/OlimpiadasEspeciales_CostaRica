const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');

const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

router.use(auth);

router.get('/', tutorController.getAll);
router.get('/:id', tutorController.getById);

// Solo Admin
router.post('/', checkRole([1]), tutorController.create);
router.put('/:id', checkRole([1]), tutorController.update);
router.delete('/:id', checkRole([1]), tutorController.delete);

module.exports = router;
