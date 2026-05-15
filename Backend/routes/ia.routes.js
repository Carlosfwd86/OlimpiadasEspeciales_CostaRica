/**
 * Rutas para el módulo de Inteligencia Artificial
 */
const express = require('express');
const router = express.Router();
const IAController = require('../controllers/IAController');
// const { verifyToken } = require('../middlewares/auth'); // Opcional: proteger rutas

// Módulo 1: Chatbot de Inclusión
router.post('/inclusion/chat', IAController.obtenerRespuestaIA);

// Módulo 2: Analista de Salud y Prevención
router.get('/salud/analizar/:atletaId', IAController.analizarSaludAtleta);

// Módulo 3: OCR Certificados
router.post('/registro/ocr', IAController.procesarCertificadoOCR);

module.exports = router;
