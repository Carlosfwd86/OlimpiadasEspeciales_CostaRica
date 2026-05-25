const checkRole = require('../../../middlewares/roleMiddleware');

describe('middlewares/roleMiddleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      user: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
  });

  it('debería retornar 401 si req.user no existe (usuario no autenticado)', () => {
    const middleware = checkRole([1, 2]); // Roles permitidos: Admin=1, Entrenador=2
    
    middleware(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 401,
      message: 'Usuario no autenticado.'
    }));
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('debería llamar a next() si el rol del usuario está dentro de los roles permitidos', () => {
    const middleware = checkRole([1, 2]);
    mockReq.user = { id: 1, rol_id: 2 }; // El usuario tiene rol 2

    middleware(mockReq, mockRes, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('debería retornar 403 si el rol del usuario no está dentro de los roles permitidos', () => {
    const middleware = checkRole([1]); // Solo Admin=1
    mockReq.user = { id: 2, rol_id: 3 }; // El usuario tiene rol 3 (Atleta/Voluntario)

    middleware(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 403,
      message: 'No tienes permiso para realizar esta acción.',
      errors: 'Nivel de acceso insuficiente.'
    }));
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('debería soportar la validación si los roles permitidos incluyen strings y el rol es comparable', () => {
    const middleware = checkRole(['ADMIN', 'COACH']);
    mockReq.user = { id: 3, rol_id: 'COACH' };

    middleware(mockReq, mockRes, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});
