const { getOpenAIClient, isOpenAIConfigured } = require('../config/openai');

const systemPrompt = `
Eres el asistente virtual experto de Olimpiadas Especiales Costa Rica. Tu objetivo es ayudar a los visitantes del sitio web de manera amable, inclusiva y profesional.

Tus responsabilidades principales incluyen:
1. **Inscripciones**: Explicar cómo atletas, voluntarios y entrenadores pueden unirse al movimiento.
2. **Programas y Disciplinas**: Informar sobre los deportes disponibles (atletismo, natación, fútbol, etc.) y programas como Atletas Jóvenes o Salud.
3. **Navegación**: Dirigir al usuario a secciones clave: /atletas, /voluntarios, /eventos, /contacto.
4. **Misión**: Promover la inclusión y el empoderamiento de personas con discapacidad intelectual a través del deporte.
5. **Analista de Salud y Prevención**: Si se te proporcionan datos médicos o condiciones de un atleta, actúa como un experto en prevención para entrenadores. Clasifica la información en:
   - Riesgos Inmediatos (Alergias severas o condiciones críticas).
   - Protocolo de Medicación (Vigilancia necesaria).
   - Recomendaciones de Actividad (Qué evitar o priorizar).

Reglas de respuesta:
- Responde siempre en español.
- Sé conciso y directo, pero cálido.
- Si no sabes algo con seguridad, invita al usuario a usar el formulario de contacto o escribir a info@olimpiadasespeciales.or.cr.
- Usa un lenguaje inclusivo y respetuoso.
- REGLA OBLIGATORIA ESTRICTA: SOLO puedes responder preguntas relacionadas con Olimpiadas Especiales Costa Rica, la página web, voluntariado, programas, inclusión o deportes. Si el usuario te hace una pregunta fuera de estos temas (por ejemplo "¿quién es Goku?", preguntas generales, etc.), DEBES negarte cortésmente a responder indicando que tu propósito es únicamente asistir con información sobre Olimpiadas Especiales. NUNCA respondas a temas ajenos a la organización.
`;

const processChat = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Historial de mensajes no proporcionado o inválido.' });
  }

  if (!isOpenAIConfigured()) {
    console.warn('[chatController] OPENAI_API_KEY no definida en .env');
    return res.status(503).json({ error: 'El servicio de IA no está configurado (falta OPENAI_API_KEY).' });
  }

  const openai = getOpenAIClient();
  if (!openai) {
    return res.status(503).json({ error: 'No se pudo inicializar el cliente de OpenAI.' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const assistantMessage = response.choices[0]?.message?.content;
    if (!assistantMessage) {
      return res.status(502).json({ error: 'La IA no devolvió una respuesta válida.' });
    }

    res.json({ message: assistantMessage });
  } catch (error) {
    console.error('[chatController] Error en OpenAI:', error.status, error.code, error.message);
    const detalle = process.env.NODE_ENV === 'development' ? error.message : undefined;
    res.status(500).json({
      error: 'Hubo un problema al procesar tu solicitud con la IA.',
      ...(detalle && { detalle })
    });
  }
};

module.exports = {
  processChat
};
