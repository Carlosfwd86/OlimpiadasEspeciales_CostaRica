const { models } = require('../config/database');
const { Consulta } = models;
const { successResponse, errorResponse } = require('../utils/apiResponse');
const consultaIaService = require('../services/consultaIaService');

/**
 * @module consultaController
 * @description Controlador para gestionar el CRUD de consultas de usuarios (ej. mensajes del formulario de contacto).
 */

/**
 * @function getAll
 * @description Obtiene el listado de todas las consultas registradas en el sistema.
 */
exports.getAll = async (req, res, next) => {
  try {
    const data = await Consulta.findAll();
    return res.status(200).json(successResponse(data, 'Consultas obtenidas'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al obtener consultas', 500, error.message));
  }
};

/**
 * @function getById
 * @description Devuelve los detalles de una consulta específica buscándola por su ID.
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('Consulta no encontrada', 404));
    return res.status(200).json(successResponse(data, 'Consulta obtenida'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al obtener consulta', 500, error.message));
  }
};

/** IA + correo en segundo plano (el usuario del formulario no espera ni ve este proceso) */
function autoResponderEnBackground(consultaId) {
  setImmediate(async () => {
    try {
      const consulta = await Consulta.findByPk(consultaId);
      if (!consulta || consulta.leida) return;
      const resultado = await consultaIaService.responderAutomatico(consulta);
      const modo = resultado.simulado ? 'simulado' : 'enviado';
      console.log(`[Auto IA] Consulta #${consultaId} → ${resultado.destinatario} (${modo})`);
    } catch (err) {
      console.error(`[Auto IA] Consulta #${consultaId}:`, err.message);
    }
  });
}

/**
 * @function create
 * @description Guarda la consulta, responde al usuario al instante; la IA envía el correo en background.
 */
exports.create = async (req, res, next) => {
  try {
    const data = await Consulta.create(req.body);

    if (consultaIaService.autoResponderHabilitado()) {
      autoResponderEnBackground(data.id);
    }

    const payload = typeof data.toJSON === 'function' ? data.toJSON() : data;
    return res.status(201).json(
      successResponse(payload, '¡Gracias! Hemos recibido tu consulta.')
    );
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al crear consulta', 500, error.message));
  }
};

/**
 * @function update
 * @description Actualiza los datos de una consulta existente (ej. marcar como leída o respondida).
 */
exports.update = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('Consulta no encontrada', 404));
    await data.update(req.body);
    return res.status(200).json(successResponse(data, 'Consulta actualizada'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al actualizar consulta', 500, error.message));
  }
};

/**
 * @function delete
 * @description Elimina permanentemente una consulta de la base de datos por su ID.
 */
exports.delete = async (req, res, next) => {
  try {
    const data = await Consulta.findByPk(req.params.id);
    if (!data) return res.status(404).json(errorResponse('Consulta no encontrada', 404));
    await data.destroy();
    return res.status(200).json(successResponse(null, 'Consulta eliminada'));
  } catch (error) { 
    return res.status(500).json(errorResponse('Error al eliminar consulta', 500, error.message));
  }
};

/**
 * Genera un borrador de respuesta institucional usando IA
 * Requiere: rol Admin. Retorna: { borrador: string }
 */
exports.sugerirRespuesta = async (req, res, next) => {
  try {
    const consulta = await Consulta.findByPk(req.params.id);
    if (!consulta) return res.status(404).json({ message: 'Consulta no encontrada' });

    const borrador = await consultaIaService.generarBorrador(consulta);
    res.json({ borrador });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    next(error);
  }
};

exports.responderConsulta = async (req, res, next) => {
  try {
    const consulta = await Consulta.findByPk(req.params.id);
    if (!consulta) return res.status(404).json({ message: 'Consulta no encontrada' });

    const { mensajeRespuesta } = req.body;
    const resultado = await consultaIaService.enviarRespuesta(consulta, mensajeRespuesta);
    return res.json(resultado);
  } catch (error) {
    console.error('Error en responderConsulta:', error);
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, error: error.message });
    return res.status(500).json({ success: false, error: error.message });
  }
};

/** Respaldo manual: procesar cola pendiente (normalmente no hace falta) */
exports.responderTodasPendientes = async (req, res, next) => {
  try {
    const resultado = await consultaIaService.procesarColaPendientes();
    return res.json(resultado);
  } catch (error) {
    console.error('Error en responderTodasPendientes:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/** IA genera borrador y envía correo al remitente en un solo paso */
exports.responderAutomatico = async (req, res, next) => {
  try {
    const consulta = await Consulta.findByPk(req.params.id);
    if (!consulta) return res.status(404).json({ message: 'Consulta no encontrada' });

    const resultado = await consultaIaService.responderAutomatico(consulta);
    return res.json(resultado);
  } catch (error) {
    console.error('Error en responderAutomatico:', error);
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, error: error.message });
    return res.status(500).json({ success: false, error: error.message });
  }
};

const nodemailer = require('nodemailer');

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
    const pass = (process.env.SMTP_PASS || '').replace(/\s/g, '');

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
