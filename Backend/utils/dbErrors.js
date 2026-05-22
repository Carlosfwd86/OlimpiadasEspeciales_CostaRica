const { errorResponse } = require('./apiResponse');

const CHECK_CONSTRAINT_CODE = '3819';
const CHECK_CONSTRAINT_ERRNO = 3819;

const CONSTRAINT_MESSAGES = {
  chk_usuarios_nombre: 'El nombre debe tener al menos 2 caracteres.',
  chk_usuarios_apellido: 'El apellido debe tener al menos 2 caracteres.',
  chk_usuarios_fecha_nac: 'La fecha de nacimiento no puede ser futura.',
  chk_usuarios_edad_max: 'La fecha de nacimiento no es válida (edad máxima 120 años).',
  chk_atletas_nombre: 'El nombre del atleta debe tener al menos 2 caracteres.',
  chk_atletas_primer_apellido: 'El primer apellido debe tener al menos 2 caracteres.',
  chk_atletas_fecha_nac: 'La fecha de nacimiento no puede ser futura.',
  chk_atletas_edad_min: 'El atleta debe tener al menos 8 años de edad.',
  chk_atletas_edad_max: 'La fecha de nacimiento del atleta no es válida (edad máxima 120 años).',
  chk_entrenadores_nombre: 'El nombre del entrenador debe tener al menos 2 caracteres.',
  chk_entrenadores_apellido: 'El apellido del entrenador debe tener al menos 2 caracteres.',
  chk_entrenadores_fecha_nac: 'La fecha de nacimiento no puede ser futura.',
  chk_entrenadores_edad_min: 'El entrenador debe ser mayor de 18 años.',
  chk_entrenadores_edad_max: 'La fecha de nacimiento del entrenador no es válida.',
  chk_entrenadores_anios_exp: 'Los años de experiencia deben estar entre 0 y 99.',
  chk_voluntarios_nombre: 'El nombre del voluntario debe tener al menos 2 caracteres.',
  chk_voluntarios_apellido: 'El apellido del voluntario debe tener al menos 2 caracteres.',
  chk_voluntarios_fecha_nac: 'La fecha de nacimiento no puede ser futura.',
  chk_voluntarios_edad_min: 'El voluntario debe ser mayor de 18 años.',
  chk_voluntarios_edad_max: 'La fecha de nacimiento del voluntario no es válida.',
  chk_competiciones_nombre: 'El nombre de la competición debe tener al menos 2 caracteres.',
  chk_competiciones_fechas: 'La fecha de fin debe ser posterior o igual a la fecha de inicio.',
  chk_competicion_atletas_posicion: 'La posición debe ser un número mayor o igual a 1.',
};

function isCheckConstraintError(error) {
  if (!error) return false;
  const parent = error.parent || error.original;
  const code = String(parent?.code || error.code || '');
  const errno = parent?.errno ?? error.errno;
  return code === CHECK_CONSTRAINT_CODE || errno === CHECK_CONSTRAINT_ERRNO;
}

function getConstraintName(error) {
  const parent = error.parent || error.original;
  const sqlMessage = parent?.sqlMessage || error.message || '';
  const match = sqlMessage.match(/CONSTRAINT `([^`]+)`/i)
    || sqlMessage.match(/constraint '([^']+)'/i);
  return match ? match[1] : null;
}

function mapDbErrorToResponse(error, defaultMessage = 'Datos inválidos.') {
  if (isCheckConstraintError(error)) {
    const name = getConstraintName(error);
    const message = (name && CONSTRAINT_MESSAGES[name])
      || 'Los datos enviados no cumplen las reglas de validación de la base de datos.';
    return errorResponse(message, 400, name || undefined);
  }
  return null;
}

function handleDbError(res, error, defaultMessage = 'Error en la operación.') {
  const mapped = mapDbErrorToResponse(error, defaultMessage);
  if (mapped) {
    return res.status(400).json(mapped);
  }
  return res.status(500).json(errorResponse(defaultMessage, 500, error.message));
}

module.exports = {
  isCheckConstraintError,
  mapDbErrorToResponse,
  handleDbError,
  CONSTRAINT_MESSAGES,
};
