const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Mocks de base de datos y helpers ANTES de requerir las rutas/controladores
const mockUsuario = {
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn()
};
const mockSesion = {
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn()
};
const mockTokenBlacklist = {
  create: jest.fn()
};

jest.mock('../../config/database', () => ({
  sequelize: {
    authenticate: jest.fn(),
    sync: jest.fn()
  },
  models: {
    Usuario: mockUsuario,
    Sesion: mockSesion,
    TokenBlacklist: mockTokenBlacklist
  }
}));

const mockSendResetEmail = jest.fn();
jest.mock('../../helpers/emailHelper', () => ({
  sendResetPasswordEmail: mockSendResetEmail
}));

// Importar rutas después de definir los mocks
const authRoutes = require('../../routes/authRoutes');

describe('Rutas de Autenticación (Integration: routes/authRoutes.js)', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    // Registrar las rutas en el endpoint estándar
    app.use('/api/v1/auth', authRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    const validUserPayload = {
      rol_id: 2,
      nombre: 'Sofía',
      apellido: 'Castro',
      correo_electronico: 'sofia@olimpiadas.org',
      password: 'Password123',
      cedula: '112340567'
    };

    it('debería retornar 400 si faltan campos obligatorios', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ nombre: 'Sofía' }); // Falta rol_id, correo_electronico, password

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toContain('Error de validación');
    });

    it('debería retornar 400 si el formato de correo electrónico es inválido', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...validUserPayload, correo_electronico: 'correo-invalido' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContainEqual(expect.objectContaining({ correo_electronico: 'Email inválido' }));
    });

    it('debería retornar 400 si la contraseña no cumple la longitud o requerimientos de seguridad', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...validUserPayload, password: '123' }); // Corta, sin mayúsculas

      expect(response.status).toBe(400);
      expect(response.body.errors).toContainEqual(expect.objectContaining({ password: 'La contraseña debe tener al menos 8 caracteres' }));
    });

    it('debería retornar 400 si el correo electrónico ya está registrado', async () => {
      // Simular que el correo ya existe
      mockUsuario.findOne.mockResolvedValue({ id: 1, correo_electronico: validUserPayload.correo_electronico });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(validUserPayload);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('El correo electrónico ya está en uso.');
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { correo_electronico: 'sofia@olimpiadas.org' } });
    });

    it('debería registrar un usuario exitosamente (retornando 201) y encriptar la contraseña', async () => {
      // Simular que el correo y cédula están libres
      mockUsuario.findOne.mockResolvedValue(null);
      mockUsuario.create.mockResolvedValue({
        id: 10,
        nombre: 'Sofía',
        apellido: 'Castro',
        cedula: '112340567',
        correo_electronico: 'sofia@olimpiadas.org',
        rol_id: 2
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(validUserPayload);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(200);
      expect(response.body.data.id).toBe(10);
      expect(mockUsuario.create).toHaveBeenCalledWith(expect.objectContaining({
        nombre: 'Sofía',
        correo_electronico: 'sofia@olimpiadas.org',
        rol_id: 2
      }));
      // Validar que la contraseña guardada no es texto plano
      const createArgs = mockUsuario.create.mock.calls[0][0];
      expect(createArgs.password_hash).not.toBe(validUserPayload.password);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    const loginPayload = {
      correo_electronico: 'sofia@olimpiadas.org',
      password: 'Password123'
    };

    it('debería retornar 400 si faltan campos del login', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ correo_electronico: 'sofia@olimpiadas.org' });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toContain('Error de validación');
    });

    it('debería retornar 401 si el usuario no existe', async () => {
      mockUsuario.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginPayload);

      expect(response.status).toBe(401);
      expect(response.body.status).toBe(401);
      expect(response.body.message).toBe('Correo o contraseña incorrectos.');
    });

    it('debería retornar 403 si la cuenta no está activa', async () => {
      mockUsuario.findOne.mockResolvedValue({
        id: 10,
        correo_electronico: 'sofia@olimpiadas.org',
        status: 'INACTIVO'
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginPayload);

      expect(response.status).toBe(403);
      expect(response.body.status).toBe(403);
      expect(response.body.message).toBe('La cuenta no está activa.');
    });

    it('debería retornar 401 si la contraseña es incorrecta', async () => {
      mockUsuario.findOne.mockResolvedValue({
        id: 10,
        correo_electronico: 'sofia@olimpiadas.org',
        password_hash: await bcrypt.hash('PasswordReal123', 10),
        status: 'ACTIVO'
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ ...loginPayload, password: 'WrongPassword' });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe(401);
      expect(response.body.message).toBe('Contraseña incorrecta.');
    });

    it('debería iniciar sesión con éxito, crear sesión en BD y establecer cookie httpOnly', async () => {
      const dbPasswordHash = await bcrypt.hash('Password123', 10);
      mockUsuario.findOne.mockResolvedValue({
        id: 10,
        nombre: 'Sofía',
        apellido: 'Castro',
        correo_electronico: 'sofia@olimpiadas.org',
        password_hash: dbPasswordHash,
        status: 'ACTIVO',
        rol_id: 2
      });
      mockSesion.create.mockResolvedValue({});

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginPayload);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.usuario.id).toBe(10);
      
      // Validar cookie httpOnly
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('token=');
      expect(cookies[0]).toContain('HttpOnly');

      expect(mockSesion.create).toHaveBeenCalledWith(expect.objectContaining({
        usuario_id: 10,
        activa: true
      }));
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('debería retornar 400 si no se envía un token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout');

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(400);
      expect(response.body.message).toBe('Token no proporcionado.');
    });

    it('debería invalidar la sesión, blacklistear el token y limpiar la cookie al cerrar sesión', async () => {
      const mockSessionRecord = {
        usuario_id: 10,
        token: 'mi-token-valido',
        activa: true,
        update: jest.fn().mockResolvedValue({})
      };
      mockSesion.findOne.mockResolvedValue(mockSessionRecord);
      mockTokenBlacklist.create.mockResolvedValue({});

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', ['token=mi-token-valido']);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toBe('Sesión cerrada exitosamente.');
      expect(mockSessionRecord.update).toHaveBeenCalledWith({ activa: false });
      expect(mockTokenBlacklist.create).toHaveBeenCalledWith(expect.objectContaining({
        usuario_id: 10,
        token: 'mi-token-valido',
        motivo: 'logout'
      }));

      // La cookie debe ser vaciada
      const cookies = response.headers['set-cookie'];
      expect(cookies[0]).toContain('token=;');
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    it('debería responder con éxito siempre para no revelar correos registrados', async () => {
      mockUsuario.findOne.mockResolvedValue({
        id: 10,
        correo_electronico: 'sofia@olimpiadas.org',
        nombre: 'Sofía',
        update: jest.fn().mockResolvedValue({})
      });
      mockSendResetEmail.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ correo_electronico: 'sofia@olimpiadas.org' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.message).toContain('recibirás un enlace de recuperación');
      expect(mockUsuario.findOne).toHaveBeenCalledWith({ where: { correo_electronico: 'sofia@olimpiadas.org' } });
      expect(mockSendResetEmail).toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('debería retornar usuario null si no hay token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ usuario: null });
    });

    it('debería retornar el payload del usuario si el token es válido', async () => {
      const mockPayload = { id: 10, rol_id: 2, email: 'sofia@olimpiadas.org', nombre: 'Sofía' };
      const validToken = jwt.sign(mockPayload, process.env.JWT_SECRET);

      mockUsuario.findByPk.mockResolvedValue({
        id: 10,
        rol_id: 2,
        correo_electronico: 'sofia@olimpiadas.org',
        nombre: 'Sofía',
        status: 'ACTIVO'
      });

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', [`token=${validToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.usuario).toEqual(expect.objectContaining({
        id: mockPayload.id,
        rol_id: mockPayload.rol_id,
        correo_electronico: mockPayload.email
      }));
    });
  });

  describe('GET /api/v1/auth/profile', () => {
    it('debería retornar 401 si no hay token de autenticación (middleware auth)', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe(401);
      expect(response.body.message).toBe('Acceso denegado. No se proporcionó un token.');
    });

    it('debería retornar el perfil del usuario si está autenticado', async () => {
      const mockPayload = { id: 10, rol_id: 2, email: 'sofia@olimpiadas.org', nombre: 'Sofía' };
      const token = jwt.sign(mockPayload, process.env.JWT_SECRET);

      mockUsuario.findByPk.mockResolvedValue({
        id: 10,
        nombre: 'Sofía',
        apellido: 'Castro',
        correo_electronico: 'sofia@olimpiadas.org',
        rol_id: 2,
        avatar_url: 'avatar.png',
        telefono: '88888888'
      });

      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Cookie', [`token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(200);
      expect(response.body.data).toEqual(expect.objectContaining({
        id: 10,
        nombre: 'Sofía',
        apellido: 'Castro',
        correoElectronico: 'sofia@olimpiadas.org',
        rol: 2,
        fotoPerfil: 'avatar.png',
        telefono: '88888888'
      }));
      expect(mockUsuario.findByPk).toHaveBeenCalledWith(10, expect.any(Object));
    });
  });
});
