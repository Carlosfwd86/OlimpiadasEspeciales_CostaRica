const { successResponse, errorResponse, getPagination, getPagingData } = require('../../../utils/apiResponse');

describe('utils/apiResponse', () => {
  describe('successResponse', () => {
    it('debería formatear correctamente una respuesta de éxito con valores por defecto', () => {
      const data = { id: 1 };
      const response = successResponse(data);
      expect(response).toEqual({
        status: 200,
        message: 'Operación exitosa',
        data
      });
    });

    it('debería incluir un mensaje personalizado y metadatos si son provistos', () => {
      const data = [{ id: 1 }];
      const meta = { total: 1 };
      const response = successResponse(data, 'Lista de atletas', meta);
      expect(response).toEqual({
        status: 200,
        message: 'Lista de atletas',
        data,
        meta
      });
    });
  });

  describe('errorResponse', () => {
    it('debería retornar un error de servidor 500 por defecto', () => {
      const response = errorResponse();
      expect(response).toEqual({
        status: 500,
        message: 'Error interno del servidor'
      });
    });

    it('debería incluir el código de estado personalizado y los detalles del error cuando se especifican', () => {
      const errors = { email: 'Formato incorrecto' };
      const response = errorResponse('Error de validación', 400, errors);
      expect(response).toEqual({
        status: 400,
        message: 'Error de validación',
        errors
      });
    });
  });

  describe('getPagination', () => {
    it('debería retornar valores de paginación por defecto si req.query está vacío', () => {
      const pagination = getPagination({});
      expect(pagination).toEqual({
        page: 1,
        limit: 1000,
        offset: 0
      });
    });

    it('debería parsear correctamente valores numéricos personalizados para page y limit', () => {
      const pagination = getPagination({ page: '3', limit: '20' });
      expect(pagination).toEqual({
        page: 3,
        limit: 20,
        offset: 40
      });
    });

    it('debería manejar valores no numéricos volviendo a los valores por defecto', () => {
      const pagination = getPagination({ page: 'abc', limit: 'xyz' });
      expect(pagination).toEqual({
        page: 1,
        limit: 1000,
        offset: 0
      });
    });
  });

  describe('getPagingData', () => {
    it('debería calcular correctamente la metadata de paginación', () => {
      const pagingData = getPagingData(50, 10, 2);
      expect(pagingData).toEqual({
        totalItems: 50,
        totalPages: 5,
        currentPage: 2,
        limit: 10
      });
    });

    it('debería calcular correctamente el total de páginas cuando no es división exacta', () => {
      const pagingData = getPagingData(25, 10, 1);
      expect(pagingData).toEqual({
        totalItems: 25,
        totalPages: 3,
        currentPage: 1,
        limit: 10
      });
    });
  });
});
