const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../middlewares/authMiddleware');

describe('middlewares/authMiddleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      cookies: {},
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
    jest.spyOn(jwt, 'verify');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería retornar 401 si no se provee ningún token en cookies ni en Authorization header', async () => {
    await authMiddleware(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 401,
      message: 'Acceso denegado. No se proporcionó un token.'
    }));
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('debería verificar exitosamente el token desde cookies y guardarlo en req.user', async () => {
    const mockUserPayload = { id: 5, rol_id: 2, nombre: 'Entrenador Juan' };
    mockReq.cookies.token = 'mockCookieToken123';
    
    jwt.verify.mockReturnValue(mockUserPayload);

    await authMiddleware(mockReq, mockRes, nextFunction);

    expect(jwt.verify).toHaveBeenCalledWith('mockCookieToken123', process.env.JWT_SECRET);
    expect(mockReq.user).toEqual(mockUserPayload);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('debería verificar exitosamente el token desde el header Authorization y guardarlo en req.user', async () => {
    const mockUserPayload = { id: 10, rol_id: 1, nombre: 'Admin Pedro' };
    mockReq.headers.authorization = 'Bearer mockHeaderToken456';
    
    jwt.verify.mockReturnValue(mockUserPayload);

    await authMiddleware(mockReq, mockRes, nextFunction);

    expect(jwt.verify).toHaveBeenCalledWith('mockHeaderToken456', process.env.JWT_SECRET);
    expect(mockReq.user).toEqual(mockUserPayload);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('debería retornar 401 si el token está expirado', async () => {
    mockReq.cookies.token = 'expiredToken';
    const expiredError = new Error('jwt expired');
    expiredError.name = 'TokenExpiredError';
    
    jwt.verify.mockImplementation(() => {
      throw expiredError;
    });

    await authMiddleware(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 401,
      message: 'El token ha expirado. Por favor, inicie sesión de nuevo.'
    }));
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('debería retornar 401 si el token es inválido o está malformado', async () => {
    mockReq.cookies.token = 'invalidToken';
    
    jwt.verify.mockImplementation(() => {
      throw new Error('invalid signature');
    });

    await authMiddleware(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 401,
      message: 'Token inválido o malformado.'
    }));
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
