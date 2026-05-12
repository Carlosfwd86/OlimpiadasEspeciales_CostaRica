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
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula')
      .matches(/[a-z]/).withMessage('Debe contener al menos una minúscula')
      .matches(/[0-9]/).withMessage('Debe contener al menos un número')
      .matches(/[@$!%*?&]/).withMessage('Debe contener al menos un carácter especial (@$!%*?&)'),
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
    body('user_name').trim().escape().notEmpty().withMessage('Nombre obligatorio'),
    body('user_email').isEmail().withMessage('Email inválido'),
    body('user_subject').trim().escape().optional(),
    body('message').trim().escape().notEmpty().withMessage('El mensaje no puede estar vacío')
  ]
};

module.exports = validators;
