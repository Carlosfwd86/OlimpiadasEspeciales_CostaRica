const { OpenAI } = require('openai');
const { Resend } = require('resend');
const nodemailer = require('nodemailer');

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function getConsultaFields(consulta) {
  const mensajeConsulta =
    consulta.mensaje || consulta.message || consulta.contenido || JSON.stringify(consulta);
  const nombreRemitente = consulta.nombre || consulta.name || 'visitante';
  const emailDestinatario = consulta.correo || consulta.email;
  return { mensajeConsulta, nombreRemitente, emailDestinatario };
}

/**
 * Genera borrador institucional con gpt-4o-mini
 */
async function generarBorrador(consulta) {
  const openai = getOpenAI();
  if (!openai) {
    const err = new Error('Servicio de IA no configurado.');
    err.statusCode = 503;
    throw err;
  }

  const { mensajeConsulta, nombreRemitente } = getConsultaFields(consulta);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Eres el asistente de comunicaciones oficial de Olimpiadas Especiales Costa Rica. 
Redactas respuestas institucionales profesionales, cálidas e inclusivas en español. 
Las respuestas deben:
- Comenzar con un saludo personalizado (ejemplo: "Estimada Nasling," o "Estimado Juan,")
- Abordar directamente la consulta del ciudadano
- Mencionar los programas o canales de contacto relevantes del sitio web cuando aplique
- Cerrar con una invitación a seguir en contacto
- Usar el tono institucional de una ONG dedicada a personas con discapacidad intelectual
- NUNCA utilices corchetes ni marcadores de posición como "[Tu Nombre]", "[Tu Nombre / Firma]", "[Tu Cargo]" o "[Firma]".
- Firma el correo de forma fija al final exactamente con la siguiente firma terminada:

Atentamente,
Equipo de Olimpiadas Especiales Costa Rica

- Longitud máxima: 150 palabras`
      },
      {
        role: 'user',
        content: `Redacta una respuesta de correo electrónico para esta consulta recibida de "${nombreRemitente}":\n\n${mensajeConsulta}`
      }
    ],
    temperature: 0.6,
    max_tokens: 400
  });

  const borrador = (response.choices[0]?.message?.content || '').trim();
  if (!borrador) {
    const err = new Error('La IA no generó un borrador válido.');
    err.statusCode = 502;
    throw err;
  }
  return borrador;
}

/**
 * Envía respuesta por correo al remitente de la consulta
 */
async function enviarRespuesta(consulta, mensajeRespuesta) {
  if (!mensajeRespuesta?.trim()) {
    const err = new Error('El mensaje de respuesta es requerido.');
    err.statusCode = 400;
    throw err;
  }

  const { emailDestinatario } = getConsultaFields(consulta);
  if (!emailDestinatario) {
    const err = new Error('La consulta no tiene correo de destinatario.');
    err.statusCode = 400;
    throw err;
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASS || '').replace(/\s/g, '');
  const smtpFrom = process.env.SMTP_FROM;

  const oauthUser = process.env.OAUTH_USER;
  const oauthClientId = process.env.OAUTH_CLIENT_ID;
  const oauthClientSecret = process.env.OAUTH_CLIENT_SECRET;
  const oauthRefreshToken = process.env.OAUTH_REFRESH_TOKEN;

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendSender = process.env.RESEND_SENDER || 'onboarding@resend.dev';
  const asunto = `RE: ${consulta.asunto || 'Consulta'}`;

  if (resendApiKey) {
    const resend = new Resend(resendApiKey);
    const response = await resend.emails.send({
      from: `Olimpiadas Especiales <${resendSender}>`,
      to: emailDestinatario,
      subject: asunto,
      text: mensajeRespuesta
    });

    if (response.error) {
      let errorMsg = response.error.message || JSON.stringify(response.error);
      if (resendSender === 'onboarding@resend.dev') {
        errorMsg +=
          "\n\nTip: Con 'onboarding@resend.dev' solo puedes enviar a tu cuenta de registro en Resend.";
      }
      const err = new Error(errorMsg);
      err.statusCode = 400;
      throw err;
    }

    await consulta.update({ leida: true });
    return {
      success: true,
      simulado: false,
      message: `Respuesta enviada con éxito vía Resend a ${emailDestinatario}`,
      destinatario: emailDestinatario
    };
  }

  if (oauthUser && oauthClientId && oauthClientSecret && oauthRefreshToken) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: oauthUser,
        clientId: oauthClientId,
        clientSecret: oauthClientSecret,
        refreshToken: oauthRefreshToken
      }
    });

    await transporter.sendMail({
      from: `"Olimpiadas Especiales Costa Rica" <${oauthUser}>`,
      to: emailDestinatario,
      subject: asunto,
      text: mensajeRespuesta
    });

    await consulta.update({ leida: true });
    return {
      success: true,
      simulado: false,
      message: `Respuesta enviada con éxito vía OAuth2 a ${emailDestinatario}`,
      destinatario: emailDestinatario
    };
  }

  if (user && pass && host) {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port == 465,
      auth: { user, pass }
    });

    const from =
      smtpFrom || `"Olimpiadas Especiales Costa Rica" <${user}>`;

    await transporter.sendMail({
      from,
      to: emailDestinatario,
      subject: asunto,
      text: mensajeRespuesta
    });

    await consulta.update({ leida: true });
    return {
      success: true,
      simulado: false,
      message: `Respuesta enviada con éxito a ${emailDestinatario}`,
      destinatario: emailDestinatario
    };
  }

  console.log(`[SMTP SIMULATOR] Enviando correo a: ${emailDestinatario}`);
  console.log(`[SMTP SIMULATOR] Asunto: ${asunto}`);
  console.log(`[SMTP SIMULATOR] Mensaje:\n${mensajeRespuesta}`);

  await consulta.update({ leida: true });
  return {
    success: true,
    simulado: true,
    message: `Borrador generado pero el correo NO se envió (SMTP no configurado). Revisa SMTP en .env.`,
    destinatario: emailDestinatario
  };
}

/**
 * Genera borrador con IA y envía al remitente en un solo paso
 */
async function responderAutomatico(consulta) {
  if (consulta.leida) {
    const err = new Error('Esta consulta ya fue respondida.');
    err.statusCode = 409;
    throw err;
  }
  const borrador = await generarBorrador(consulta);
  const envio = await enviarRespuesta(consulta, borrador);
  return { borrador, ...envio };
}

function autoResponderHabilitado() {
  return process.env.CONSULTAS_AUTO_RESPONDER === 'true';
}

module.exports = {
  generarBorrador,
  enviarRespuesta,
  responderAutomatico,
  autoResponderHabilitado
};
