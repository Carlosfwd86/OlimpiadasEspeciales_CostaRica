/**
 * Controlador de Configuración del Sistema
 * GET /api/settings  — obtiene todas las preferencias desde la BD
 * PUT /api/settings  — actualiza una o varias preferencias en la BD
 *
 * Persistencia: tabla `system_settings` (clave/valor) gestionada por Sequelize.
 * Los valores se almacenan como strings JSON para soportar booleanos y números
 * sin perder tipo. Se usan JSON.parse / JSON.stringify en cada operación.
 */

const { models } = require('../config/database');
const { SystemSetting } = models;

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Convierte el array de registros [{clave, valor}] al objeto plano
 * que espera el frontend: { tema: 'light', notificaciones: true, ... }
 */
function rowsToObject(rows) {
  return rows.reduce((acc, row) => {
    try {
      acc[row.clave] = JSON.parse(row.valor);
    } catch {
      acc[row.clave] = row.valor; // fallback: string crudo
    }
    return acc;
  }, {});
}

/**
 * @function getSettings
 * @description Obtiene todas las configuraciones globales, las parsea y las devuelve como un objeto plano.
 */
const getSettings = async (req, res) => {
  try {
    const rows = await SystemSetting.findAll({
      attributes: ['clave', 'valor'],
      order: [['clave', 'ASC']]
    });

    return res.status(200).json({
      data: rowsToObject(rows),
      message: 'OK',
      status: 200
    });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    return res.status(500).json({ error: 'Error al obtener la configuración del sistema.' });
  }
};

/**
 * @function updateSettings
 * @description Modifica uno o varios parámetros de configuración globales serializándolos en JSON.
 */
const updateSettings = async (req, res) => {
  try {
    const camposPermitidos = ['tema', 'idioma', 'notificaciones', 'registro_automatico'];
    const updates = [];

    for (const campo of camposPermitidos) {
      if (req.body[campo] !== undefined) {
        // Persistir como JSON para preservar el tipo (boolean, string, number)
        updates.push(
          SystemSetting.update(
            { valor: JSON.stringify(req.body[campo]) },
            { where: { clave: campo } }
          )
        );
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos válidos para actualizar.' });
    }

    await Promise.all(updates);

    // Devolver el estado actualizado completo
    const rows = await SystemSetting.findAll({
      attributes: ['clave', 'valor'],
      order: [['clave', 'ASC']]
    });

    return res.status(200).json({
      data: rowsToObject(rows),
      message: 'Configuración actualizada correctamente',
      status: 200
    });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    return res.status(500).json({ error: 'Error al actualizar la configuración del sistema.' });
  }
};

module.exports = { getSettings, updateSettings };
