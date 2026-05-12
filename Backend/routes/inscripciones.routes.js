const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionController');

const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

router.use(auth);

router.get('/', inscripcionController.getAll);
router.get('/:id', inscripcionController.getById);

// Solo Admin
router.post('/', checkRole([1]), inscripcionController.create);
router.put('/:id', checkRole([1]), inscripcionController.update);
router.delete('/:id', checkRole([1]), inscripcionController.delete);

module.exports = router;
