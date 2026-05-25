const IAHelper = require('../../../helpers/IAHelper');

describe('helpers/IAHelper', () => {
  describe('limpiarYValidarPrompt', () => {
    it('debería lanzar un error si el prompt es nulo, indefinido o no es una cadena de texto', () => {
      expect(() => IAHelper.limpiarYValidarPrompt(null)).toThrow('El prompt es inválido o está vacío.');
      expect(() => IAHelper.limpiarYValidarPrompt(undefined)).toThrow('El prompt es inválido o está vacío.');
      expect(() => IAHelper.limpiarYValidarPrompt(12345)).toThrow('El prompt es inválido o está vacío.');
    });

    it('debería eliminar espacios en blanco adicionales en los extremos', () => {
      const limpio = IAHelper.limpiarYValidarPrompt('   Hola, necesito ayuda   ');
      expect(limpio).toBe('Hola, necesito ayuda');
    });

    it('debería eliminar caracteres de control no deseados (código ASCII no visible)', () => {
      const sucio = 'Hola\x00mundo\x1F';
      const limpio = IAHelper.limpiarYValidarPrompt(sucio);
      expect(limpio).toBe('Holamundo');
    });

    it('debería recortar el prompt a 2000 caracteres si excede ese límite', () => {
      const largo = 'a'.repeat(2500);
      const limpio = IAHelper.limpiarYValidarPrompt(largo);
      expect(limpio).toHaveLength(2000);
      expect(limpio).toBe('a'.repeat(2000));
    });
  });

  describe('validarDatosSalud', () => {
    it('debería lanzar un error si no se proporciona la información del atleta', () => {
      expect(() => {
        IAHelper.validarDatosSalud(null, [], []);
      }).toThrow('Información del atleta no encontrada.');
    });

    it('debería formatear correctamente la información de salud cuando se tienen datos válidos', () => {
      const atleta = { nombre: 'Andrés', primer_apellido: 'Chaves' };
      const condiciones = [{ condicion: 'Asma' }];
      const medicamentos = [
        { medicamento: 'Salbutamol', dosis: '2 inhalaciones', frecuencia: 'Cada 8 horas' }
      ];
      const alergias = [{ alergia: 'Penicilina' }];

      const resultado = IAHelper.validarDatosSalud(atleta, condiciones, medicamentos, alergias);

      expect(resultado).toEqual({
        nombre: 'Andrés Chaves',
        condiciones: 'Asma',
        medicamentos: 'Salbutamol (2 inhalaciones, Cada 8 horas)',
        alergias: 'Penicilina'
      });
    });

    it('debería manejar campos vacíos y retornar valores por defecto legibles', () => {
      const atleta = { nombre: 'María', primer_apellido: 'López' };
      const condiciones = [];
      const medicamentos = [];
      const alergias = [];

      const resultado = IAHelper.validarDatosSalud(atleta, condiciones, medicamentos, alergias);

      expect(resultado).toEqual({
        nombre: 'María López',
        condiciones: 'Ninguna registrada',
        medicamentos: 'Ninguno registrado',
        alergias: 'Ninguna registrada'
      });
    });

    it('debería retornar información de dosis o frecuencia no especificada en medicamentos si faltan', () => {
      const atleta = { nombre: 'Luis', primer_apellido: 'Mora' };
      const condiciones = [];
      const medicamentos = [{ medicamento: 'Paracetamol' }]; // Sin dosis ni frecuencia

      const resultado = IAHelper.validarDatosSalud(atleta, condiciones, medicamentos);

      expect(resultado.medicamentos).toBe('Paracetamol (dosis no especificada, frecuencia no especificada)');
    });
  });
});
