const { body } = require('express-validator');

function calcularEdad(fechaStr) {
  const nacimiento = new Date(fechaStr);
  if (Number.isNaN(nacimiento.getTime())) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
}

function validarFechaNoFutura(value) {
  if (!value) return true;
  const fecha = new Date(value);
  if (Number.isNaN(fecha.getTime())) throw new Error('Fecha inválida');
  const hoy = new Date();
  hoy.setHours(23, 59, 59, 999);
  if (fecha > hoy) throw new Error('La fecha de nacimiento no puede ser futura');
  return true;
}

function validarEdadAtleta(value) {
  if (!value) throw new Error('La fecha de nacimiento es obligatoria');
  validarFechaNoFutura(value);
  const edad = calcularEdad(value);
  if (edad === null) throw new Error('Fecha de nacimiento inválida');
  if (edad < 8) throw new Error('El atleta debe tener al menos 8 años de edad');
  if (edad > 120) throw new Error('La fecha de nacimiento no es válida');
  return true;
}

function validarEdadAdulto(value) {
  if (!value) return true;
  validarFechaNoFutura(value);
  const edad = calcularEdad(value);
  if (edad === null) throw new Error('Fecha de nacimiento inválida');
  if (edad < 18) throw new Error('Debe ser mayor de 18 años');
  if (edad > 120) throw new Error('La fecha de nacimiento no es válida');
  return true;
}

/**
 * Esquemas de validación centralizados para reforzar la seguridad.
 */
const validators = {
  registro: [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),
    body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio').isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),
    body('correo_electronico')
      .isEmail().withMessage('Email inválido')
      .customSanitizer(value => value ? value.toLowerCase().trim() : value),
    body('password')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
      .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número'),
    body('rol_id').isInt().withMessage('Rol inválido'),
    body('cedula').optional({ checkFalsy: true }).isString().withMessage('La cédula debe tener formato válido'),
    body('telefono').optional({ checkFalsy: true }).isString().withMessage('Teléfono inválido'),
    body('pais').optional({ checkFalsy: true }).isString().withMessage('País inválido'),
    body('genero').optional({ checkFalsy: true }).isIn(['Masculino', 'Femenino', 'Otro']).withMessage('Género inválido'),
    body('fecha_nacimiento').optional({ checkFalsy: true }).isDate().withMessage('Fecha de nacimiento inválida').custom(validarFechaNoFutura)
  ],

  login: [
    body('correo_electronico')
      .isEmail().withMessage('Formato de email incorrecto')
      .customSanitizer(value => value ? value.toLowerCase().trim() : value),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
  ],

  atleta: [
    body('nombre').trim().notEmpty().withMessage('El nombre del atleta es obligatorio').isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),
    body('primer_apellido').trim().notEmpty().withMessage('El primer apellido es obligatorio').isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),
    body('fecha_nacimiento').isDate().withMessage('Fecha de nacimiento inválida').custom(validarEdadAtleta),
    body('genero').isIn(['Masculino', 'Femenino', 'Otro']).withMessage('Género no válido'),
    body('correo_electronico').optional({ checkFalsy: true }).isEmail().withMessage('Email de contacto inválido')
  ],

  entrenador: [
    body('nombre').optional().trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('apellido').optional().trim().isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
    body('fecha_nacimiento').optional({ checkFalsy: true }).isDate().withMessage('Fecha de nacimiento inválida').custom(validarEdadAdulto),
    body('fechaNacimiento').optional({ checkFalsy: true }).isDate().withMessage('Fecha de nacimiento inválida').custom(validarEdadAdulto),
    body('anios_experiencia').optional({ checkFalsy: true }).isInt({ min: 0, max: 99 }).withMessage('Los años de experiencia deben estar entre 0 y 99'),
    body('aniosExperiencia').optional({ checkFalsy: true }).isInt({ min: 0, max: 99 }).withMessage('Los años de experiencia deben estar entre 0 y 99')
  ],

  voluntario: [
    body('nombre').optional().trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('apellido').optional().trim().isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
    body('fecha_nacimiento').optional({ checkFalsy: true }).isDate().withMessage('Fecha de nacimiento inválida').custom(validarEdadAdulto),
    body('fechaNacimiento').optional({ checkFalsy: true }).isDate().withMessage('Fecha de nacimiento inválida').custom(validarEdadAdulto)
  ],

  competicion: [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),
    body('fecha_inicio').isDate().withMessage('Fecha de inicio inválida'),
    body('fecha_fin').optional({ checkFalsy: true }).isDate().withMessage('Fecha de fin inválida').custom((value, { req }) => {
      if (!value || !req.body.fecha_inicio) return true;
      if (new Date(value) < new Date(req.body.fecha_inicio)) {
        throw new Error('La fecha de fin debe ser posterior o igual a la fecha de inicio');
      }
      return true;
    })
  ],

  competicionActualizar: [
    body('nombre').optional().trim().isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),
    body('fecha_inicio').optional().isDate().withMessage('Fecha de inicio inválida'),
    body('fecha_fin').optional({ checkFalsy: true }).isDate().withMessage('Fecha de fin inválida')
  ],

  consulta: [
    body('nombre').trim().escape().notEmpty().withMessage('Nombre obligatorio'),
    body('correo').isEmail().withMessage('Email inválido'),
    body('asunto').trim().escape().notEmpty().withMessage('Asunto obligatorio'),
    body('mensaje').trim().escape().notEmpty().withMessage('El mensaje no puede estar vacío').isLength({ min: 10 }).withMessage('Mínimo 10 caracteres')
  ],

  forgotPassword: [
    body('correo_electronico').isEmail().withMessage('Formato de email incorrecto').normalizeEmail()
  ],

  resetPassword: [
    body('token').notEmpty().withMessage('El token es obligatorio'),
    body('password')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
      .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
  ]
};

module.exports = validators;
