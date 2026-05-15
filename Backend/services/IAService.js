/**
 * Servicio de Inteligencia Artificial de Élite
 * Maneja la comunicación con APIs externas (OpenAI, Claude, etc.)
 */
const axios = require('axios'); // Asegúrate de instalarlo con: npm install axios

const IAService = {
    /**
     * Módulo 1: Asistente de Inclusión (Chatbot)
     * Actúa como experto en reglamentos de Olimpiadas Especiales
     */
    obtenerRespuestaInclusion: async (promptLimpio) => {
        try {
            // Configuración del System Message para guiar el comportamiento de la IA
            const systemMessage = `
                Eres el "Asistente de Inclusión" oficial de Olimpiadas Especiales Costa Rica. 
                Tu objetivo es orientar a entrenadores y familias sobre el Reglamento de Participación y 
                el Código de Conducta. Tus respuestas deben ser empáticas, profesionales y enfocadas 
                en la inclusión deportiva de personas con discapacidad intelectual.
            `;

            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4",
                messages: [
                    { role: "system", content: systemMessage },
                    { role: "user", content: promptLimpio }
                ],
                temperature: 0.7
            }, {
                headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error("Error en IAService (Inclusión):", error.message);
            return "Lo siento, en este momento no puedo procesar tu consulta. Por favor, intenta más tarde.";
        }
    },

    /**
     * Módulo 2: Analista de Salud y Prevención (NLP)
     * Genera resumen ejecutivo de alertas preventivas para entrenadores
     */
    generarAlertasSalud: async (datosAtleta) => {
        try {
            const prompt = `
                Analiza los siguientes datos médicos del atleta ${datosAtleta.nombre}:
                Condiciones: ${datosAtleta.condiciones}
                Medicamentos: ${datosAtleta.medicamentos}
                
                Genera un resumen ejecutivo de máximo 3 puntos clave sobre "Alertas Preventivas" 
                que un entrenador debe tener en cuenta durante el entrenamiento físico. 
                Enfócate en riesgos de hidratación, fatiga o interacciones con medicamentos.
            `;

            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Eres un Analista de Salud Deportiva experto en medicina para atletas con discapacidad." },
                    { role: "user", content: prompt }
                ]
            }, {
                headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error("Error en IAService (Salud):", error.message);
            throw new Error("No se pudo generar el análisis de salud.");
        }
    },

    /**
     * Módulo 3: OCR para Registro (Simulado para integración)
     * Procesa imágenes para extraer fechas de vencimiento y nombres
     */
    procesarDocumentoOCR: async (base64Imagen) => {
        try {
            // Aquí se integraría con Google Cloud Vision o AWS Textract
            // Ejemplo conceptual de llamada a Google Vision API
            /*
            const response = await axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_API_KEY}`, {
                requests: [{
                    image: { content: base64Imagen },
                    features: [{ type: "TEXT_DETECTION" }]
                }]
            });
            */

            // Mock de respuesta procesada por IA
            return {
                nombreAtleta: "Extraído vía IA",
                fechaVencimiento: "2025-12-31",
                valido: true
            };
        } catch (error) {
            console.error("Error en IAService (OCR):", error.message);
            throw new Error("Fallo en el procesamiento OCR del certificado.");
        }
    }
};

module.exports = IAService;
