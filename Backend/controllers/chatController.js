const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
Eres el asistente virtual experto de Olimpiadas Especiales Costa Rica. Tu objetivo es ayudar a los visitantes del sitio web de manera amable, inclusiva y profesional.

Tus responsabilidades principales incluyen:
1. **Inscripciones**: Explicar cómo atletas, voluntarios y entrenadores pueden unirse al movimiento.
2. **Programas y Disciplinas**: Informar sobre los deportes disponibles (atletismo, natación, fútbol, etc.) y programas como Atletas Jóvenes o Salud.
3. **Navegación**: Dirigir al usuario a secciones clave: /atletas, /voluntarios, /eventos, /contacto.
4. **Misión**: Promover la inclusión y el empoderamiento de personas con discapacidad intelectual a través del deporte.

Reglas de respuesta:
- Responde siempre en español.
- Sé conciso y directo, pero cálido.
- Si no sabes algo con seguridad, invita al usuario a usar el formulario de contacto o escribir a info@olimpiadasespeciales.or.cr.
- Usa un lenguaje inclusivo y respetuoso.
`;

/**
 * @module chatController
 * @description Controlador para gestionar las interacciones con el chatbot impulsado por OpenAI.
 */

/**
 * @function processChat
 * @description Procesa los mensajes recibidos del frontend, los envía a la API de OpenAI y devuelve la respuesta del asistente virtual.
 */
const processChat = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Historial de mensajes no proporcionado o inválido.' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = response.choices[0].message.content;
    res.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error en OpenAI:', error);
    res.status(500).json({ error: 'Hubo un problema al procesar tu solicitud con la IA.' });
  }
};

module.exports = {
  processChat,
};
