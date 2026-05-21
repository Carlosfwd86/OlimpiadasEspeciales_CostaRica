const { models } = require('../config/database');
const { Consulta } = models;
const { OpenAI } = require('openai');
const { Resend } = require('resend');

exports.getAll = async (req, res, next) => {
  try {
    const data = await Consulta.findAll();
    res.json(data);
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Consulta no encontrado' });
    res.json(data);
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await Consulta.create(req.body);
    res.status(201).json(data);
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Consulta no encontrado' });
    await data.update(req.body);
    res.json(data);
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Consulta no encontrado' });
    await data.destroy();
    res.json({ message: 'Consulta eliminado' });
  } catch (error) { next(error); }
};

/**
 * Genera un borrador de respuesta institucional usando IA
 * Requiere: rol Admin. Retorna: { borrador: string }
 */
exports.sugerirRespuesta = async (req, res, next) => {
  try {
    const consulta = await Consulta.findByPk(req.params.id);
    if (!consulta) return res.status(404).json({ message: 'Consulta no encontrada' });

    const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
    if (!openai) return res.status(503).json({ message: 'Servicio de IA no configurado.' });

    const mensajeConsulta = consulta.mensaje || consulta.message || consulta.contenido || JSON.stringify(consulta);
    const nombreRemitente = consulta.nombre || consulta.name || 'visitante';

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

    const borrador = response.choices[0].message.content;
    res.json({ borrador });
  } catch (error) { next(error); }
};

const nodemailer = require('nodemailer');

exports.responderConsulta = async (req, res, next) => {
  try {
    const consulta = await Consulta.findByPk(req.params.id);
    if (!consulta) return res.status(404).json({ message: 'Consulta no encontrada' });

    const { mensajeRespuesta } = req.body;
    if (!mensajeRespuesta) return res.status(400).json({ message: 'El mensaje de respuesta es requerido.' });

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    const oauthUser = process.env.OAUTH_USER;
    const oauthClientId = process.env.OAUTH_CLIENT_ID;
    const oauthClientSecret = process.env.OAUTH_CLIENT_SECRET;
    const oauthRefreshToken = process.env.OAUTH_REFRESH_TOKEN;

    const emailDestinatario = consulta.correo || consulta.email;

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendSender = process.env.RESEND_SENDER || 'onboarding@resend.dev';

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const response = await resend.emails.send({
        from: `Olimpiadas Especiales <${resendSender}>`,
        to: emailDestinatario,
        subject: `RE: ${consulta.asunto || 'Consulta'}`,
        text: mensajeRespuesta
      });

      if (response.error) {
        console.error("Error retornado por Resend API:", response.error);
        let errorMsg = response.error.message || JSON.stringify(response.error);
        if (resendSender === 'onboarding@resend.dev') {
          errorMsg += "\n\n💡 Tip de Pruebas: Al usar el remitente gratuito 'onboarding@resend.dev' de Resend, solo puedes enviar correos a la misma cuenta con la que te registraste en Resend. Si quieres probar el envío real, asegúrate de que el correo del ciudadano al que respondes sea tu misma cuenta de registro de Resend.";
        }
        return res.status(400).json({ success: false, error: errorMsg });
      }

      await consulta.update({ leida: true });

      return res.json({ success: true, message: `Respuesta enviada con éxito vía Resend a ${emailDestinatario}` });
    } else if (oauthUser && oauthClientId && oauthClientSecret && oauthRefreshToken) {
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
        subject: `RE: ${consulta.asunto || 'Consulta'}`,
        text: mensajeRespuesta
      });

      await consulta.update({ leida: true });

      return res.json({ success: true, message: `Respuesta enviada con éxito vía OAuth2 a ${emailDestinatario}` });
    } else if (user && pass && host) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port == 465,
        auth: { user, pass }
      });

      await transporter.sendMail({
        from: `"Olimpiadas Especiales Costa Rica" <${user}>`,
        to: emailDestinatario,
        subject: `RE: ${consulta.asunto || 'Consulta'}`,
        text: mensajeRespuesta
      });

      await consulta.update({ leida: true });

      return res.json({ success: true, message: `Respuesta enviada con éxito a ${emailDestinatario}` });
    } else {
      console.log(`[SMTP SIMULATOR] Enviando correo a: ${emailDestinatario}`);
      console.log(`[SMTP SIMULATOR] Asunto: RE: ${consulta.asunto || 'Consulta'}`);
      console.log(`[SMTP SIMULATOR] Mensaje:\n${mensajeRespuesta}`);

      await consulta.update({ leida: true });

      return res.json({ 
        success: true, 
        simulado: true,
        message: `Respuesta enviada (Simulado) a ${emailDestinatario}` 
      });
    }
  } catch (error) {
    console.error("Error en responderConsulta:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.responderMasivo = async (req, res, next) => {
  try {
    const { correos, asunto, mensajeRespuesta, consultaIds } = req.body;
    
    if (!correos || !Array.isArray(correos) || correos.length === 0) {
      return res.status(400).json({ message: 'Se requiere una lista de correos (arreglo).' });
    }
    if (!mensajeRespuesta) {
      return res.status(400).json({ message: 'El mensaje de respuesta es requerido.' });
    }

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = process.env.SMTP_PORT || 465;
    const user = process.env.SMTP_USER; 
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
       return res.status(500).json({ success: false, message: 'Credenciales de correo (SMTP_USER / SMTP_PASS) no configuradas en el backend (.env).' });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port == 465, // true for 465, false for other ports
      auth: { user, pass }
    });

    // Enviar correo a múltiples destinatarios usando bcc para privacidad
    await transporter.sendMail({
      from: `"Olimpiadas Especiales Costa Rica" <${user}>`,
      to: user, // Se envía al mismo remitente (o a un correo genérico de la ONG)
      bcc: correos, // Aquí van los múltiples correos en copia oculta
      subject: asunto || 'Respuesta Oficial - Olimpiadas Especiales',
      text: mensajeRespuesta,
      html: `<div style="font-family: sans-serif; padding: 20px;">${mensajeRespuesta.replace(/\n/g, '<br>')}</div>` // Soporte básico para HTML
    });

    // Si el frontend envía los IDs de las consultas, marcarlas como leídas
    if (consultaIds && Array.isArray(consultaIds) && consultaIds.length > 0) {
      await Consulta.update(
        { leida: true },
        { where: { id: consultaIds } }
      );
    }

    return res.json({ success: true, message: `Correos enviados masivamente a ${correos.length} destinatarios.` });
  } catch (error) {
    console.error("Error en responderMasivo:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
