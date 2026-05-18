// ─────────────────────────────────────────────────────────────────────────────
// ARCHIVO: c:\Users\FWD8D\OneDrive\Desktop\OlimpiadasEspeciales_CostaRica\Backend\controllers\certificadoController.js
// DESCRIPCIÓN: Controlador para gestionar la recepción, validación y orquestación del análisis OCR
//              de los certificados médicos de los atletas de Olimpiadas Especiales Costa Rica.
// ─────────────────────────────────────────────────────────────────────────────

const { analizarCertificadoOcr } = require('../services/servicioOcr');

/**
 * Procesa el archivo de certificado médico enviado por el usuario, valida su existencia
 * y solicita al servicio de OCR/IA la extracción estructurada del nombre y fecha de vencimiento.
 * @param {Object} peticion - Objeto de petición Express (contiene req.file).
 * @param {Object} respuesta - Objeto de respuesta Express.
 */
const procesarCertificado = async (peticion, respuesta) => {
  try {
    const archivoCertificado = peticion.file;

    // Validación crítica: verificar que realmente se haya adjuntado un archivo en el cuerpo de la petición.
    if (!archivoCertificado) {
      return respuesta.status(400).json({
        exito: false,
        mensaje: 'No se ha proporcionado ningún archivo. Asegúrese de enviar el documento bajo el campo "certificado".'
      });
    }

    // Informar en la consola del servidor sobre el inicio del procesamiento del documento.
    console.log(`[OCR Certificado] Iniciando análisis para el archivo: ${archivoCertificado.originalname} (${archivoCertificado.mimetype})`);

    // Invocar al servicio de Inteligencia Artificial para extraer la información.
    const datosExtraidos = await analizarCertificadoOcr(archivoCertificado);

    // Responder exitosamente al frontend con los datos estructurados extraídos del certificado.
    return respuesta.status(200).json({
      exito: true,
      mensaje: 'Certificado analizado con éxito utilizando Inteligencia Artificial OCR de Visión.',
      datos: {
        nombre_atleta: datosExtraidos.nombre_atleta || 'No detectado',
        fecha_vencimiento: datosExtraidos.fecha_vencimiento || null
      }
    });

  } catch (errorProcesamiento) {
    // Registro detallado del error en la consola del servidor para diagnóstico técnico.
    console.error('[Error Controlador Certificado]:', errorProcesamiento);

    // Identificar el tipo de error para dar una respuesta HTTP semánticamente adecuada.
    const mensajeError = errorProcesamiento.message || 'Error inesperado al analizar el certificado médico.';
    const codigoEstado = mensajeError.includes('formato de imagen') ? 400 : 500;

    return respuesta.status(codigoEstado).json({
      exito: false,
      mensaje: 'Ocurrió un error al procesar el certificado médico.',
      error: mensajeError
    });
  }
};

module.exports = {
  procesarCertificado
};
