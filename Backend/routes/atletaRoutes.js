const express = require('express');
const router = express.Router();
const atletaController = require('../controllers/atletaController');

// [verde] Definición de rutas para el módulo de Atletas
// [verde] Las rutas permiten gestionar el ciclo de vida completo de la información del atleta

// [verde] Ruta para obtener el listado completo de atletas
router.get('/', atletaController.obtenerTodosLosAtletas);

// [verde] Ruta para obtener un atleta por su ID único
router.get('/:id', atletaController.obtenerAtletaPorId);

// [verde] Ruta para registrar un nuevo atleta en el sistema
router.post('/', atletaController.crearAtleta);

// [verde] Ruta para actualizar los datos de un atleta existente
router.put('/:id', atletaController.actualizarAtleta);

// [verde] Ruta para dar de baja/eliminar a un atleta
router.delete('/:id', atletaController.eliminarAtleta);

module.exports = router;
