const { body } = require('express-validator');

/**
 * Esquemas de validación centralizados para reforzar la seguridad.
 */
const validators = {
  // Validación para el registro de usuarios
  registro: [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ min: 2 }).withMessage('Mínimo 2 caracteres'),
    body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio'),
    body('correo_electronico').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('rol_id').isInt().withMessage('Rol inválido'),
    body('cedula').optional().isNumeric().withMessage('La cédula debe ser numérica')
  ],

  // Validación para inicio de sesión
  login: [
    body('correo_electronico').isEmail().withMessage('Formato de email incorrecto').normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
  ],

  // Validación para Atletas
  atleta: [
    body('nombre').trim().notEmpty().withMessage('El nombre del atleta es obligatorio'),
    body('primer_apellido').trim().notEmpty().withMessage('El primer apellido es obligatorio'),
    body('fecha_nacimiento').isDate().withMessage('Fecha de nacimiento inválida'),
    body('genero').isIn(['Masculino', 'Femenino', 'Otro']).withMessage('Género no válido'),
    body('correo_electronico').optional({ checkFalsy: true }).isEmail().withMessage('Email de contacto inválido')
  ],

  // Validación para Consultas/Mensajes (Saneamiento contra XSS)
  consulta: [
    body('nombre').trim().escape().notEmpty().withMessage('Nombre obligatorio'),
    body('correo').isEmail().withMessage('Email inválido'),
    body('asunto').trim().escape().notEmpty().withMessage('Asunto obligatorio'),
    body('mensaje').trim().escape().notEmpty().withMessage('El mensaje no puede estar vacío').isLength({ min: 10 }).withMessage('Mínimo 10 caracteres')
  ]
};

module.exports = validators;
