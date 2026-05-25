// Entorno de prueba
process.env.NODE_ENV = 'test';

// Claves obligatorias para inicialización de módulos
process.env.JWT_SECRET = 'secreto_super_seguro_de_pruebas_1234567890_abcdef';
process.env.DOCUMENT_ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // 64 hex chars (32 bytes)
process.env.FRONTEND_URL = 'http://localhost:5173';
