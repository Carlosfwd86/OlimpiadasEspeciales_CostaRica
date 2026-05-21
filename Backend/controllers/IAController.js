/**
 * Controlador de Inteligencia Artificial
 * Maneja las peticiones del frontend para los módulos de IA
 */
const IAService = require('../services/IAService');
const IAHelper = require('../helpers/IAHelper');
const Atleta = require('../models/Atleta');
const AtletaCondicion = require('../models/AtletaCondicion');
const AtletaMedicamento = require('../models/AtletaMedicamento');
const AtletaAlergia = require('../models/AtletaAlergia');

const IAController = {
    /**
     * Maneja el chat del Asistente de Inclusión
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
     * Genera análisis de salud preventivo para un atleta específico
     */
    analizarSaludAtleta: async (req, res) => {
        try {
            const { atletaId } = req.params;

            // 1. Obtener datos completos de Sequelize (incluyendo alergias)
            const atleta = await Atleta.findByPk(atletaId);
            const condiciones = await AtletaCondicion.findAll({ where: { atleta_id: atletaId } });
            const medicamentos = await AtletaMedicamento.findAll({ where: { atleta_id: atletaId } });
            const alergias = await AtletaAlergia.findAll({ where: { atleta_id: atletaId } });

            // 2. Validar y estructurar datos mediante Helper (con alergias)
            const datosAtleta = IAHelper.validarDatosSalud(atleta, condiciones, medicamentos, alergias);

            // 3. Procesar con IA (retorna JSON estructurado)
            const analisis = await IAService.generarAlertasSalud(datosAtleta);

            return res.status(200).json({ success: true, analisis });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * Procesa la imagen de un certificado médico
     */
    procesarCertificadoOCR: async (req, res) => {
        try {
            const { imagenBase64 } = req.body;

            if (!imagenBase64) {
                return res.status(400).json({ success: false, error: 'No se recibió ninguna imagen para procesar.' });
            }

            const resultado = await IAService.procesarDocumentoOCR(imagenBase64);

            return res.status(200).json({ success: true, datos: resultado });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * Valida visualmente un comprobante de donación (SINPE, transferencia bancaria)
     * Body esperado: { imagenBase64 }
     */
    procesarComprobante: async (req, res) => {
        try {
            const { imagenBase64 } = req.body;

            if (!imagenBase64) {
                return res.status(400).json({ success: false, error: 'No se recibió ninguna imagen del comprobante.' });
            }

            const resultado = await IAService.validarComprobanteFinanciero(imagenBase64);

            return res.status(200).json({ success: true, comprobante: resultado });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = IAController;
