const { successResponse, errorResponse } = require('../../../utils/responseFormatter');

describe('utils/responseFormatter', () => {
  describe('successResponse', () => {
    it('debería retornar un objeto con success=true, el mensaje provisto y data en null por defecto', () => {
      const response = successResponse('Operación completada');
      expect(response).toEqual({
        success: true,
        message: 'Operación completada',
        data: null
      });
    });

    it('debería retornar los datos adjuntos cuando se proporciona el parámetro data', () => {
      const mockData = { id: 1, nombre: 'Juan' };
      const response = successResponse('Atleta encontrado', mockData);
      expect(response).toEqual({
        success: true,
        message: 'Atleta encontrado',
        data: mockData
      });
    });
  });

  describe('errorResponse', () => {
    it('debería retornar un objeto con success=false, el mensaje provisto y errors en null por defecto', () => {
      const response = errorResponse('Error al guardar datos');
      expect(response).toEqual({
        success: false,
        message: 'Error al guardar datos',
        errors: null
      });
    });

    it('debería incluir los detalles de los errores cuando se proporciona el parámetro errors', () => {
      const mockErrors = ['El nombre es requerido', 'La fecha de nacimiento no es válida'];
      const response = errorResponse('Error de validación', mockErrors);
      expect(response).toEqual({
        success: false,
        message: 'Error de validación',
        errors: mockErrors
      });
    });
  });
});
