/**
 * Rutas para el módulo de Inteligencia Artificial
 */
const express = require('express');
const router = express.Router();
const IAController = require('../controllers/IAController');
// const { verifyToken } = require('../middlewares/auth'); // Opcional: proteger rutas

// Módulo 1: Chatbot de Inclusión
router.post('/inclusion/chat', IAController.obtenerRespuestaIA);

// Módulo 2: Analista de Salud y Prevención (retorna JSON { nivelRiesgo, alertas[], recomendaciones[] })
router.get('/salud/analizar/:atletaId', IAController.analizarSaludAtleta);

// Módulo 3: OCR Certificados Médicos (retorna JSON con campos del formulario)
router.post('/registro/ocr', IAController.procesarCertificadoOCR);

// Módulo 4: Validación de Comprobantes de Donación (retorna JSON { monto, referencia, valido })
router.post('/donacion/validar', IAController.procesarComprobante);

module.exports = router;
