const express = require('express');
const router = express.Router();
const atletaController = require('../controllers/atletaController');

// [verde] Definición de rutas para el módulo de Atletas
// [verde] Las rutas permiten gestionar el ciclo de vida completo de la información del atleta

const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validationMiddleware');
const validators = require('../utils/validators');
const { cargarDocumentoAtleta, handleMulterError } = require('../middlewares/manejoArchivos');

// [verde] Todas las rutas de atletas requieren autenticación
router.use(auth);

// [verde] Listado y detalle (Cualquier usuario autenticado)
router.get('/', atletaController.obtenerTodosLosAtletas);
router.get('/:id', atletaController.obtenerAtletaPorId);
router.get('/:id/documentos', atletaController.obtenerDocumentosAtleta);
router.get('/:id/documentos/:docId/download', atletaController.descargarDocumentoAtleta);

// [verde] Operaciones de escritura (Solo Administradores - ID: 1)
router.post('/', checkRole([1]), validators.atleta, validate, atletaController.crearAtleta);
router.post('/:id/documentos', checkRole([1]), (req, res, next) => {
  cargarDocumentoAtleta(req, res, (err) => {
    if (err) return handleMulterError(err, req, res, next);
    atletaController.agregarDocumento(req, res);
  });
});
router.put('/:id', checkRole([1]), validators.atleta, validate, atletaController.actualizarAtleta);
router.delete('/:id', checkRole([1]), atletaController.eliminarAtleta);
router.delete('/:id/documentos/:docId', checkRole([1]), atletaController.eliminarDocumento);

module.exports = router;
