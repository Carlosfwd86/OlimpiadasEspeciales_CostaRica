const fs = require('fs');
const path = require('path');
const { encryptBuffer, decryptFileFromDisk, sha256, getStorageRoot, ensureDir, getEncryptionKey } = require('../../../utils/fileEncryption');

jest.mock('fs');

describe('utils/fileEncryption', () => {
  describe('getEncryptionKey', () => {
    it('debería retornar un Buffer de 32 bytes si la clave en env es válida', () => {
      const key = getEncryptionKey();
      expect(key).toBeInstanceOf(Buffer);
      expect(key.length).toBe(32);
    });

    it('debería lanzar un error si la clave no tiene 64 caracteres hex', () => {
      const originalKey = process.env.DOCUMENT_ENCRYPTION_KEY;
      
      process.env.DOCUMENT_ENCRYPTION_KEY = 'clave_invalida';
      expect(() => getEncryptionKey()).toThrow('[fileEncryption] DOCUMENT_ENCRYPTION_KEY debe ser 64 caracteres hex');
      
      process.env.DOCUMENT_ENCRYPTION_KEY = originalKey; // Restaurar
    });
  });

  describe('encryptBuffer y decryptFileFromDisk', () => {
    it('debería cifrar un buffer y permitir su posterior descifrado de disco', () => {
      const originalText = 'Información médica confidencial';
      const buffer = Buffer.from(originalText, 'utf8');

      // Cifrar
      const { ciphertext, iv, authTag } = encryptBuffer(buffer);
      expect(ciphertext).toBeInstanceOf(Buffer);
      expect(iv).toHaveLength(24); // 12 bytes en representación hex
      expect(authTag).toHaveLength(32); // 16 bytes en representación hex

      // Simular que el archivo cifrado existe en disco
      const mockStorageKey = 'atleta_1_certificado.enc';
      const expectedPath = path.join(getStorageRoot(), mockStorageKey);

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(ciphertext);

      // Descifrar
      const decryptedBuffer = decryptFileFromDisk(mockStorageKey, iv, authTag);
      expect(decryptedBuffer.toString('utf8')).toBe(originalText);

      expect(fs.existsSync).toHaveBeenCalledWith(expectedPath);
      expect(fs.readFileSync).toHaveBeenCalledWith(expectedPath);
    });

    it('debería lanzar un error si el archivo a descifrar no existe en disco', () => {
      fs.existsSync.mockReturnValue(false);

      expect(() => {
        decryptFileFromDisk('archivo_no_existente.enc', 'iv', 'authtag');
      }).toThrow('Archivo cifrado no encontrado en almacenamiento.');
    });
  });

  describe('sha256', () => {
    it('debería calcular el hash sha256 correcto de un buffer', () => {
      const buffer = Buffer.from('test', 'utf8');
      const hash = sha256(buffer);
      // Hash sha256 conocido para la palabra "test"
      expect(hash).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
    });
  });

  describe('ensureDir', () => {
    it('debería crear el directorio si no existe', () => {
      fs.existsSync.mockReturnValue(false);
      
      ensureDir('/ruta/de/prueba');
      
      expect(fs.existsSync).toHaveBeenCalledWith('/ruta/de/prueba');
      expect(fs.mkdirSync).toHaveBeenCalledWith('/ruta/de/prueba', { recursive: true });
    });

    it('debería omitir la creación si el directorio ya existe', () => {
      fs.existsSync.mockReturnValue(true);
      fs.mkdirSync.mockClear();
      
      ensureDir('/ruta/existente');
      
      expect(fs.existsSync).toHaveBeenCalledWith('/ruta/existente');
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });
});
