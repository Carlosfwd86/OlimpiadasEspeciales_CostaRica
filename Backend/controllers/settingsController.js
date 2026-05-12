/**
 * Controlador de Configuración del Sistema
 * GET /api/settings  — obtiene preferencias del sistema
 * PUT /api/settings  — actualiza preferencias del sistema
 *
 * En esta primera versión las preferencias se almacenan en memoria/fallback.
 * Para persistencia real, crear una tabla `system_settings` con Sequelize.
 */

// Configuración por defecto del sistema
let systemConfig = {
  tema: 'light',
  idioma: 'es',
  notificaciones: true,
  registro_automatico: false
};

/**
 * GET /api/settings
 */
const getSettings = async (req, res) => {
  try {
    return res.status(200).json({
      data: systemConfig,
      message: 'OK',
      status: 200
    });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    return res.status(500).json({ error: 'Error al obtener la configuración del sistema.' });
  }
};

/**
 * PUT /api/settings
 */
const updateSettings = async (req, res) => {
  try {
    const { tema, idioma, notificaciones, registro_automatico } = req.body;

    // Actualizar solo los campos enviados
    if (tema !== undefined)               systemConfig.tema = tema;
    if (idioma !== undefined)             systemConfig.idioma = idioma;
    if (notificaciones !== undefined)     systemConfig.notificaciones = notificaciones;
    if (registro_automatico !== undefined) systemConfig.registro_automatico = registro_automatico;

    return res.status(200).json({
      data: systemConfig,
      message: 'Configuración actualizada correctamente',
      status: 200
    });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    return res.status(500).json({ error: 'Error al actualizar la configuración del sistema.' });
  }
};

module.exports = { getSettings, updateSettings };
