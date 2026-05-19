// ─────────────────────────────────────────────────────────────────────────────
// ARCHIVO: c:\Users\FWD8D\OneDrive\Desktop\OlimpiadasEspeciales_CostaRica\Backend\routes\certificadoRoutes.js
// DESCRIPCIÓN: Definición de rutas Express para el módulo de procesamiento de certificados médicos.
//              Conecta el middleware de subida Multer con el controlador de OCR con Inteligencia Artificial.
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const enrutador = express.Router();

const { cargarCertificado } = require('../middlewares/manejoArchivos');
const { procesarCertificado } = require('../controllers/certificadoController');

// Ruta POST para recibir y analizar un certificado médico de deportista.
// Se ejecuta primero el middleware de validación y carga en memoria ('cargarCertificado').
// Posteriormente se pasa el control al controlador ('procesarCertificado') para orquestar la IA.
enrutador.post('/analizar', cargarCertificado, procesarCertificado);

module.exports = enrutador;
