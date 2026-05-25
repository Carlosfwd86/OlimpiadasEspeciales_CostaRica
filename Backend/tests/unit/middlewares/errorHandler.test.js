const errorHandler = require('../../../middlewares/errorHandler');

describe('middlewares/errorHandler', () => {
  let mockReq;
  let mockRes;
  let nextFunction;
  let consoleSpy;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('debería manejar errores de tipo SequelizeValidationError con estado 400 y mapear los mensajes', () => {
    const error = new Error('Validation error');
    error.name = 'SequelizeValidationError';
    error.errors = [
      { message: 'El nombre es obligatorio' },
      { message: 'El correo electrónico debe ser único' }
    ];

    errorHandler(error, mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 400,
      message: 'Error de validación de datos',
      errors: ['El nombre es obligatorio', 'El correo electrónico debe ser único']
    });
  });

  it('debería manejar errores de tipo SequelizeUniqueConstraintError con estado 409 e indicar el campo duplicado', () => {
    const error = new Error('Unique constraint error');
    error.name = 'SequelizeUniqueConstraintError';
    error.errors = [{ path: 'correo_electronico' }];

    errorHandler(error, mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 409,
      message: 'Ya existe un registro con ese correo_electronico.'
    });
  });

  it('debería manejar errores de tipo SequelizeForeignKeyConstraintError con estado 409', () => {
    const error = new Error('Foreign key error');
    error.name = 'SequelizeForeignKeyConstraintError';

    errorHandler(error, mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 409,
      message: 'No se puede eliminar: existen registros relacionados.'
    });
  });

  it('debería manejar errores de tipo SequelizeDatabaseError con estado 500', () => {
    const error = new Error('Database error');
    error.name = 'SequelizeDatabaseError';

    errorHandler(error, mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 500,
      message: 'Error de base de datos.'
    });
  });

  it('debería manejar errores generales con statusCode personalizado y detalles', () => {
    const error = new Error('Acceso no permitido');
    error.statusCode = 403;
    error.details = 'Token sin permisos suficientes';

    errorHandler(error, mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 403,
      message: 'Acceso no permitido',
      errors: 'Token sin permisos suficientes'
    });
  });

  it('debería responder con 500 y mensaje genérico si el error no tiene código ni mensaje específico', () => {
    const error = {};

    errorHandler(error, mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 500,
      message: 'Error interno del servidor'
    });
  });
});
