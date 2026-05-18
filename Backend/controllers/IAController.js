/**
 * Controlador de Inteligencia Artificial
 * Maneja las peticiones del frontend para los módulos de IA
 */
const IAService = require('../services/IAService');
const IAHelper = require('../helpers/IAHelper');
const Atleta = require('../models/Atleta');
const AtletaCondicion = require('../models/AtletaCondicion');
const AtletaMedicamento = require('../models/AtletaMedicamento');

const IAController = {
    /**
     * @function obtenerRespuestaIA
     * @description Maneja las interacciones del chat del Asistente de Inclusión. 
     * Limpia el prompt del usuario mediante IAHelper y solicita una respuesta a IAService.
     */
    obtenerRespuestaIA: async (req, res) => {
        try {
            const { prompt } = req.body;
            
            // 1. Limpieza y validación mediante Helper
            const promptLimpio = IAHelper.limpiarYValidarPrompt(prompt);

            // 2. Procesamiento mediante Service
            const respuesta = await IAService.obtenerRespuestaInclusion(promptLimpio);

            return res.status(200).json({ success: true, respuesta });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    },

    /**
     * @function analizarSaludAtleta
     * @description Genera un análisis de salud preventivo para un atleta específico usando IA.
     * Consolida datos de condiciones y medicamentos, los formatea y solicita alertas de salud a IAService.
     */
    analizarSaludAtleta: async (req, res) => {
        try {
            const { atletaId } = req.params;

            // 1. Obtener datos de Sequelize
            const atleta = await Atleta.findByPk(atletaId);
            const condiciones = await AtletaCondicion.findAll({ where: { atleta_id: atletaId } });
            const medicamentos = await AtletaMedicamento.findAll({ where: { atleta_id: atletaId } });

            // 2. Validar y estructurar datos mediante Helper
            const datosAtleta = IAHelper.validarDatosSalud(atleta, condiciones, medicamentos);

            // 3. Procesar con IA
            const analisis = await IAService.generarAlertasSalud(datosAtleta);

            return res.status(200).json({ success: true, analisis });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * @function procesarCertificadoOCR
     * @description Procesa una imagen de certificado médico (Base64) extrayendo sus datos mediante OCR vía IA.
     */
    procesarCertificadoOCR: async (req, res) => {
        try {
            const { imagenBase64 } = req.body; // Recibido por onClick desde el cliente

            if (!imagenBase64) {
                return res.status(400).json({ success: false, error: 'No se recibió ninguna imagen para procesar.' });
            }

            const resultado = await IAService.procesarDocumentoOCR(imagenBase64);

            return res.status(200).json({ success: true, datos: resultado });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = IAController;
