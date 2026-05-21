/**
 * Servicio de Inteligencia Artificial
 * Maneja la comunicación con la API de OpenAI para los módulos de IA del proyecto
 */
const { OpenAI } = require('openai');

let openai = null;
try {
    if (process.env.OPENAI_API_KEY) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } else {
        console.warn('[IAService] Advertencia: OPENAI_API_KEY no definida.');
    }
} catch (error) {
    console.error('[IAService] Error al inicializar OpenAI:', error.message);
}

const IAService = {

    /**
     * Módulo 1: Asistente de Inclusión (Chatbot)
     * Actúa como experto en reglamentos de Olimpiadas Especiales
     */
    obtenerRespuestaInclusion: async (promptLimpio) => {
        try {
            if (!openai) throw new Error('Servicio de IA no configurado.');
            const systemMessage = `
                Eres el "Asistente de Inclusión" oficial de Olimpiadas Especiales Costa Rica.
                Tu objetivo es orientar a entrenadores y familias sobre el Reglamento de Participación y
                el Código de Conducta. Tus respuestas deben ser empáticas, profesionales y enfocadas
                en la inclusión deportiva de personas con discapacidad intelectual.
                Redirige al usuario a rutas del sitio cuando sea relevante: /registro, /voluntarios, /contacto, /programas.
            `;
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemMessage },
                    { role: 'user', content: promptLimpio }
                ],
                temperature: 0.7,
                max_tokens: 500
            });
            return response.choices[0].message.content;
        } catch (error) {
            console.error('[IAService] Error (Inclusión):', error.message);
            return 'Lo siento, en este momento no puedo procesar tu consulta. Por favor, intenta más tarde.';
        }
    },

    /**
     * Módulo 2: Analista de Salud y Prevención
     * Genera resumen ejecutivo de alertas preventivas para entrenadores.
     * RESPUESTA: JSON estricto { nivelRiesgo, alertas[], recomendaciones[] }
     */
    generarAlertasSalud: async (datosAtleta) => {
        if (!openai) throw new Error('Servicio de IA no configurado.');

        const prompt = `
Analiza los siguientes datos médicos del atleta con discapacidad intelectual que participa en Olimpiadas Especiales Costa Rica:

Nombre: ${datosAtleta.nombre}
Condiciones médicas: ${datosAtleta.condiciones}
Medicamentos actuales: ${datosAtleta.medicamentos}
Alergias: ${datosAtleta.alergias || 'Ninguna registrada'}

Genera un análisis preventivo para el entrenador. Responde ÚNICAMENTE con JSON válido (sin texto extra, sin markdown):
{
  "nivelRiesgo": "Rojo|Amarillo|Verde",
  "alertas": ["alerta concisa 1", "alerta concisa 2"],
  "recomendaciones": ["recomendación accionable 1", "recomendación accionable 2"]
}

Criterios:
- Rojo: epilepsia activa, alergias anafilácticas, cardiopatías severas
- Amarillo: diabetes, asma, medicamentos con efectos en el ejercicio
- Verde: sin restricciones significativas para el deporte
Máximo 3 alertas y 3 recomendaciones. Sé directo y claro para un entrenador deportivo.
        `;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'Eres un Analista de Salud Deportiva experto en medicina preventiva para atletas con discapacidad intelectual. Respondes SIEMPRE con JSON válido y estructurado.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 600,
            response_format: { type: 'json_object' }
        });

        return JSON.parse(response.choices[0].message.content);
    },

    /**
     * Módulo 3: OCR para Certificados Médicos (GPT-4o Vision)
     * Extrae datos estructurados de imágenes de certificados de la CCSS.
     * RESPUESTA: JSON { nombre, cedula, fechaNacimiento, medicamentos[], condiciones[], valido }
     */
    procesarDocumentoOCR: async (base64Imagen) => {
        if (!openai) throw new Error('Servicio de IA no configurado.');

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Analiza esta imagen de un certificado médico de la Caja Costarricense de Seguro Social (CCSS) de Costa Rica.
Extrae la información y responde ÚNICAMENTE con JSON válido (sin texto extra):
{
  "nombre": "nombre completo del paciente o null",
  "cedula": "número de cédula o null",
  "fechaNacimiento": "YYYY-MM-DD o null",
  "fechaEmision": "YYYY-MM-DD o null",
  "fechaVencimiento": "YYYY-MM-DD o null",
  "medicamentos": ["medicamento con dosis si aparece"],
  "condiciones": ["condición médica si aparece"],
  "medico": "nombre del médico firmante o null",
  "numeroCarne": "número de carné del médico CCSS o null",
  "valido": true
}
Si la imagen NO es un certificado médico válido: {"valido": false, "error": "descripción del problema"}`
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Imagen}`,
                                detail: 'high'
                            }
                        }
                    ]
                }
            ],
            max_tokens: 1000,
            response_format: { type: 'json_object' }
        });

        return JSON.parse(response.choices[0].message.content);
    },

    /**
     * Módulo 4: Validación de Comprobantes de Donación (GPT-4o Vision)
     * Extrae datos financieros de capturas de pantalla de transferencias/SINPE.
     * RESPUESTA: JSON { monto, moneda, referencia, fecha, banco, estado, valido }
     */
    validarComprobanteFinanciero: async (base64Imagen) => {
        if (!openai) throw new Error('Servicio de IA no configurado.');

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Analiza esta imagen de un comprobante de pago o transferencia bancaria costarricense (SINPE Móvil, IBAN, app bancaria).
Extrae la información y responde ÚNICAMENTE con JSON válido (sin texto extra):
{
  "monto": número sin símbolos (ej: 25000),
  "moneda": "CRC" o "USD",
  "referencia": "número de referencia/transacción o null",
  "fecha": "YYYY-MM-DD o null",
  "hora": "HH:MM o null",
  "banco": "nombre del banco o plataforma o null",
  "emisor": "nombre del donante si aparece o null",
  "estado": "EXITOSA|PENDIENTE|FALLIDA",
  "valido": true
}
Si la imagen NO es un comprobante de pago legible: {"valido": false, "error": "descripción del problema"}`
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Imagen}`,
                                detail: 'high'
                            }
                        }
                    ]
                }
            ],
            max_tokens: 800,
            response_format: { type: 'json_object' }
        });

        return JSON.parse(response.choices[0].message.content);
    }
};

module.exports = IAService;
