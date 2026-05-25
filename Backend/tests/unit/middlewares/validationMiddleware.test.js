const { validationResult } = require('express-validator');
const validate = require('../../../middlewares/validationMiddleware');

jest.mock('express-validator');

describe('middlewares/validationMiddleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
  });

  it('debería llamar a next() si no existen errores de validación', () => {
    // Simular que express-validator no encuentra errores
    validationResult.mockReturnValue({
      isEmpty: () => true
    });

    validate(mockReq, mockRes, nextFunction);

    expect(validationResult).toHaveBeenCalledWith(mockReq);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('debería retornar 400 con los errores estructurados cuando existen errores de validación', () => {
    // Simular que express-validator encuentra errores de validación
    const mockErrorsArray = [
      { path: 'correo_electronico', msg: 'Email inválido' },
      { path: 'password', msg: 'La contraseña debe tener al menos 8 caracteres' }
    ];

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => mockErrorsArray
    });

    validate(mockReq, mockRes, nextFunction);

    expect(validationResult).toHaveBeenCalledWith(mockReq);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 400,
      message: 'Error de validación de datos',
      errors: [
        { correo_electronico: 'Email inválido' },
        { password: 'La contraseña debe tener al menos 8 caracteres' }
      ]
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
