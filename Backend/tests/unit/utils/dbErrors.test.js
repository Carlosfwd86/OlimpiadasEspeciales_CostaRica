const { isCheckConstraintError, mapDbErrorToResponse, handleDbError, CONSTRAINT_MESSAGES } = require('../../../utils/dbErrors');

describe('utils/dbErrors', () => {
  describe('isCheckConstraintError', () => {
    it('debería retornar false si no se provee un objeto de error', () => {
      expect(isCheckConstraintError(null)).toBe(false);
      expect(isCheckConstraintError(undefined)).toBe(false);
    });

    it('debería retornar true si el código de error principal es 3819', () => {
      const error = { code: '3819' };
      expect(isCheckConstraintError(error)).toBe(true);
    });

    it('debería retornar true si el errno principal es 3819', () => {
      const error = { errno: 3819 };
      expect(isCheckConstraintError(error)).toBe(true);
    });

    it('debería buscar en error.parent si las propiedades directas no coinciden', () => {
      const error = { parent: { code: '3819' } };
      expect(isCheckConstraintError(error)).toBe(true);
    });

    it('debería buscar en error.original si las propiedades directas no coinciden', () => {
      const error = { original: { errno: 3819 } };
      expect(isCheckConstraintError(error)).toBe(true);
    });

    it('debería retornar false para otros códigos de error', () => {
      const error = { code: '1062' }; // Duplicate entry
      expect(isCheckConstraintError(error)).toBe(false);
    });
  });

  describe('mapDbErrorToResponse', () => {
    it('debería retornar null si el error no es un check constraint error', () => {
      const error = { code: '1062' };
      expect(mapDbErrorToResponse(error)).toBeNull();
    });

    it('debería mapear correctamente un check constraint conocido por su nombre', () => {
      const error = {
        code: '3819',
        message: 'Check constraint \'chk_usuarios_nombre\' is violated.'
      };
      const response = mapDbErrorToResponse(error);
      expect(response).toEqual({
        status: 400,
        message: CONSTRAINT_MESSAGES.chk_usuarios_nombre,
        errors: 'chk_usuarios_nombre'
      });
    });

    it('debería mapear con acentos graves (backticks) de SQL', () => {
      const error = {
        code: '3819',
        parent: {
          sqlMessage: 'Check constraint `chk_atletas_edad_min` is violated.'
        }
      };
      const response = mapDbErrorToResponse(error);
      expect(response).toEqual({
        status: 400,
        message: CONSTRAINT_MESSAGES.chk_atletas_edad_min,
        errors: 'chk_atletas_edad_min'
      });
    });

    it('debería retornar un mensaje por defecto si la restricción es desconocida', () => {
      const error = {
        code: '3819',
        message: 'Check constraint \'chk_restriccion_desconocida\' is violated.'
      };
      const response = mapDbErrorToResponse(error);
      expect(response).toEqual({
        status: 400,
        message: 'Los datos enviados no cumplen las reglas de validación de la base de datos.',
        errors: 'chk_restriccion_desconocida'
      });
    });
  });

  describe('handleDbError', () => {
    let mockRes;

    beforeEach(() => {
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
    });

    it('debería responder con 400 y el error mapeado si es un check constraint', () => {
      const error = {
        code: '3819',
        message: 'Check constraint \'chk_usuarios_nombre\' is violated.'
      };
      handleDbError(mockRes, error);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 400,
        message: CONSTRAINT_MESSAGES.chk_usuarios_nombre,
        errors: 'chk_usuarios_nombre'
      });
    });

    it('debería responder con 500 y el mensaje por defecto si no es un check constraint', () => {
      const error = {
        code: '1062',
        message: 'Duplicate entry \'test@test.com\' for key \'correo\''
      };
      handleDbError(mockRes, error, 'Error al registrar');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Error al registrar',
        errors: 'Duplicate entry \'test@test.com\' for key \'correo\''
      });
    });
  });
});
