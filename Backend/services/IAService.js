/**
 * Servicio de Inteligencia Artificial — comunicación con OpenAI
 */
const { getOpenAIClient, isOpenAIConfigured } = require('../config/openai');

const requireOpenAI = () => {
  if (!isOpenAIConfigured()) {
    throw new Error('OPENAI_API_KEY no está configurada en el archivo .env del Backend.');
  }
  const client = getOpenAIClient();
  if (!client) throw new Error('No se pudo inicializar el cliente de OpenAI.');
  return client;
};

const modelChat = () => process.env.OPENAI_MODEL || 'gpt-4o-mini';
const modelVision = () => process.env.OPENAI_VISION_MODEL || 'gpt-4o';

const IAService = {

  obtenerRespuestaInclusion: async (promptLimpio) => {
    try {
      const openai = requireOpenAI();
      const systemMessage = `
Eres el "Asistente de Inclusión" oficial de Olimpiadas Especiales Costa Rica.
Tu objetivo es orientar a entrenadores y familias sobre el Reglamento de Participación y
el Código de Conducta. Tus respuestas deben ser empáticas, profesionales y enfocadas
en la inclusión deportiva de personas con discapacidad intelectual.
Redirige al usuario a rutas del sitio cuando sea relevante: /registro, /voluntarios, /contacto, /programas.
`;
      const response = await openai.chat.completions.create({
        model: modelChat(),
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: promptLimpio }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      return response.choices[0]?.message?.content || 'Sin respuesta de la IA.';
    } catch (error) {
      console.error('[IAService] Error (Inclusión):', error.message);
      throw error;
    }
  },

  generarAlertasSalud: async (datosAtleta) => {
    const openai = requireOpenAI();

    const prompt = `
Analiza los siguientes datos médicos del atleta con discapacidad intelectual que participa en Olimpiadas Especiales Costa Rica:

Nombre: ${datosAtleta.nombre}
Condiciones médicas: ${datosAtleta.condiciones}
Medicamentos actuales: ${datosAtleta.medicamentos}
Alergias: ${datosAtleta.alergias}

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
      model: modelChat(),
      messages: [
        {
          role: 'system',
          content: 'Eres un Analista de Salud Deportiva experto en medicina preventiva para atletas con discapacidad intelectual. Respondes SIEMPRE con JSON válido y estructurado.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 600,
      response_format: { type: 'json_object' }
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error('OpenAI no devolvió contenido en el análisis de salud.');
    return JSON.parse(raw);
  },

  procesarDocumentoOCR: async (base64Imagen) => {
    const openai = requireOpenAI();

    const response = await openai.chat.completions.create({
      model: modelVision(),
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

  validarComprobanteFinanciero: async (base64Imagen) => {
    const openai = requireOpenAI();

    const response = await openai.chat.completions.create({
      model: modelVision(),
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
