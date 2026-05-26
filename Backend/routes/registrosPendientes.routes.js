const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');
const { cargarDocumentosRegistro, handleMulterError } = require('../middlewares/manejoArchivos');
const documentoService = require('../services/documentoService');
const { dispararAnalisisIA } = require('../services/openaiDocumentService');
const { models } = require('../config/database');
const { RegistroPendiente } = models;
const { Op } = require('sequelize');
const { getPagination, getPagingData, successResponse } = require('../utils/apiResponse');

function parseRegistroBody(req) {
  if (req.body.datos) {
    return typeof req.body.datos === 'string' ? JSON.parse(req.body.datos) : req.body.datos;
  }
  return req.body;
}

async function crearRegistroPendiente(req, res) {
  let registro;
  try {
    registro = parseRegistroBody(req);
  } catch {
    return res.status(400).json({ error: 'El campo datos no contiene JSON válido.' });
  }

  const nuevoRegistro = await RegistroPendiente.create({
    usuario_id: registro.usuarioId || registro.usuario_id || null,
    rol: registro.rol || 'atleta',
    correo_electronico: registro.correoElectronico || registro.correo_electronico || registro.email || null,
    datos: registro,
    estado: 'PENDIENTE',
  });

  let documentos = [];
  if (req.files && Object.keys(req.files).length > 0) {
    documentos = await documentoService.savePendingFilesFromRequest(nuevoRegistro.id, req.files);

    // Disparar análisis IA en segundo plano (fire-and-forget, no bloquea el response)
    dispararAnalisisIA(nuevoRegistro.id, documentos);
  }

  return res.status(201).json({
    data: {
      ...nuevoRegistro.toJSON(),
      documentos,
    },
    message: 'Creado',
    status: 201,
  });
}

router.get('/', auth, checkRole([1]), async (req, res) => {
  try {
    const { limit, offset, page } = getPagination(req.query);
    const { search } = req.query;

    const whereClause = { estado: 'PENDIENTE' };
    if (search) {
      whereClause.correo_electronico = { [Op.like]: `%${search}%` };
    }

    const { count, rows: registros } = await RegistroPendiente.findAndCountAll({
      where: whereClause,
      order: [['fecha_registro', 'DESC']],
      limit,
      offset,
    });

    const data = registros.map((r) => {
      const payload = r.datos || {};
      const fullName = payload.nombre + (payload.apellido ? ` ${payload.apellido}` : '');
      const initials = payload.nombre
        ? (payload.nombre.charAt(0) + (payload.apellido ? payload.apellido.charAt(0) : '')).toUpperCase()
        : '??';
      const timeAgo = new Date(r.fecha_registro).toLocaleDateString();
      const colors = ['blue', 'red', 'green', 'orange', 'purple', 'yellow'];
      const bgColor = colors[r.id % colors.length];

      return {
        id: r.id,
        name: fullName || 'N/A',
        email: r.correo_electronico || payload.correoElectronico || 'N/A',
        phone: payload.telefono || '',
        sport: payload.disciplina || payload.disciplinaPrincipal || 'N/A',
        region: payload.pais || 'Nacional',
        status: r.estado,
        statusColor: 'orange',
        bgColor: `bg-${bgColor}`,
        initials,
        time: timeAgo,
        rol: r.rol,
        datos: payload,
      };
    });

    const meta = getPagingData(count, limit, page);
    return res.status(200).json(successResponse(data, 'OK', meta));
  } catch (error) {
    console.error('Error al obtener registros pendientes:', error);
    return res.status(500).json({ error: 'Error al obtener los registros pendientes.' });
  }
});

router.get('/:id/documentos', auth, checkRole([1]), async (req, res) => {
  try {
    const { id } = req.params;
    const { RegistroPendienteDocumento } = models;
    const registro = await RegistroPendiente.findByPk(id);
    if (!registro) return res.status(404).json({ error: 'Registro no encontrado.' });

    // Obtener documentos incluyendo los campos de análisis IA
    const rows = await RegistroPendienteDocumento.findAll({
      where: { registro_pendiente_id: id },
      attributes: ['id', 'categoria', 'nombre_original', 'mime_type', 'tamano_bytes', 'estado_ia', 'analisis_ia', 'created_at'],
      order: [['id', 'ASC']],
    });

    const documentos = rows.map((r) => ({
      id: r.id,
      categoria: r.categoria,
      nombre_original: r.nombre_original,
      mime_type: r.mime_type,
      tamano_bytes: r.tamano_bytes,
      estado_ia: r.estado_ia,
      analisis_ia: r.analisis_ia,
      created_at: r.created_at,
    }));

    return res.status(200).json(successResponse(documentos, 'Documentos del registro'));
  } catch (error) {
    console.error('Error listando documentos pendientes:', error);
    return res.status(500).json({ error: 'Error al listar documentos.' });
  }
});

router.get('/:id/documentos/:docId/download', auth, checkRole([1]), async (req, res) => {
  try {
    const { id, docId } = req.params;
    const doc = await documentoService.getPendingDocumentForDownload(id, docId);
    if (!doc) return res.status(404).json({ error: 'Documento no encontrado.' });

    const meta = await documentoService.resolveDownloadMeta(doc);
    if (!meta) return res.status(404).json({ error: 'Archivo no disponible en S3.' });

    // Legado: enviar buffer descifrado
    res.setHeader('Content-Type', meta.mime_type);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(meta.nombre)}"`
    );
    return res.send(meta.buffer);
  } catch (error) {
    console.error('Error descargando documento:', error);
    return res.status(500).json({ error: 'Error al descargar el documento.' });
  }
});

router.post('/', (req, res, next) => {
  const contentType = req.headers['content-type'] || '';

  const runCreate = async () => {
    try {
      await crearRegistroPendiente(req, res);
    } catch (error) {
      console.error('Error en POST /registros-pendientes:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error al crear registro pendiente.' });
      }
    }
  };

  if (contentType.includes('multipart/form-data')) {
    cargarDocumentosRegistro(req, res, (err) => {
      if (err) return handleMulterError(err, req, res, next);
      runCreate();
    });
  } else {
    runCreate();
  }
});

router.patch('/:id', auth, checkRole([1]), async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };
    if (body.status !== undefined && body.estado === undefined) {
      body.estado = body.status;
      delete body.status;
    }
    if (body.estado === 'RECHAZADO') body.estado = 'RECHAZADA';
    if (body.estado === 'APROBADO') body.estado = 'APROBADA';

    if (body.estado === 'RECHAZADA') {
      await documentoService.deletePendingByRegistro(id);
    }

    const [updated] = await RegistroPendiente.update(body, { where: { id } });
    if (!updated) return res.status(404).json({ error: 'Registro no encontrado.' });
    const data = await RegistroPendiente.findByPk(id);
    return res.status(200).json({ data, message: 'OK', status: 200 });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar registro.' });
  }
});

router.delete('/:id', auth, checkRole([1]), async (req, res) => {
  try {
    const { id } = req.params;
    await documentoService.deletePendingByRegistro(id);
    await RegistroPendiente.destroy({ where: { id } });
    return res.status(200).json({ message: 'Eliminado', status: 200 });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar registro.' });
  }
});

module.exports = router;
