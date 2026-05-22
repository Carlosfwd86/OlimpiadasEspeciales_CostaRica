/**
 * Genera la colección Postman en la raíz del repositorio.
 * Ejecutar: node Backend/scripts/generate-postman-collection.js
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../../Olimpiadas_Especiales_CostaRica.postman_collection.json');

const bearer = { type: 'bearer', bearer: [{ key: 'token', value: '{{token}}', type: 'string' }] };
const json = (body) => ({ mode: 'raw', raw: typeof body === 'string' ? body : JSON.stringify(body, null, 2), options: { raw: { language: 'json' } } });
const hdr = () => [{ key: 'Content-Type', value: 'application/json' }];

function req(name, method, pathSegments, opts = {}) {
  const item = {
    name,
    request: {
      method,
      header: opts.headers || (opts.body ? hdr() : []),
      url: {
        raw: `{{base_url}}/api/v1${pathSegments}${opts.query ? '?' + opts.query : ''}`,
        host: ['{{base_url}}'],
        path: ['api', 'v1', ...pathSegments.replace(/^\//, '').split('/').filter(Boolean)],
      },
    },
    response: [],
  };
  if (opts.query) {
    item.request.url.query = opts.queryParams || [];
  }
  if (opts.body) item.request.body = json(opts.body);
  if (opts.auth) item.request.auth = bearer;
  if (opts.formdata) {
    item.request.body = { mode: 'formdata', formdata: opts.formdata };
    item.request.header = [];
  }
  return item;
}

const loginTest = {
  listen: 'test',
  script: {
    type: 'text/javascript',
    exec: [
      'const r = pm.response.json();',
      'if (r.token) { pm.collectionVariables.set("token", r.token); }',
    ],
  },
};

const folders = [
  {
    name: '1. Autenticación',
    item: [
      req('Registrar usuario', 'POST', '/auth/register', { body: { nombre: 'Usuario', primer_apellido: 'Prueba', correo_electronico: 'prueba@oe.cr', contrasena: 'ClaveSegura123!', rol_id: 2 } }),
      { ...req('Iniciar sesión', 'POST', '/auth/login', { body: { correo_electronico: 'admin@olimpiadas.cr', contrasena: 'Admin1234!' } }), event: [loginTest] },
      req('Sesión actual (me)', 'GET', '/auth/me'),
      req('Perfil', 'GET', '/auth/profile', { auth: true }),
      req('Actualizar perfil', 'PATCH', '/auth/profile', { auth: true, body: { telefono: '8888-8888' } }),
      req('Cerrar sesión', 'POST', '/auth/logout'),
      req('Olvidé contraseña', 'POST', '/auth/forgot-password', { body: { correo_electronico: 'admin@olimpiadas.cr' } }),
      req('Restablecer contraseña', 'POST', '/auth/reset-password', { body: { token: 'TOKEN', contrasena: 'NuevaClave123!' } }),
    ],
  },
  {
    name: '2. Atletas',
    item: [
      req('Listar atletas', 'GET', '/atletas', { auth: true }),
      req('Buscar atletas', 'GET', '/atletas', { auth: true, query: true, queryParams: [{ key: 'search', value: 'Gerson' }] }),
      req('Atleta por ID', 'GET', '/atletas/1', { auth: true }),
      req('Documentos del atleta', 'GET', '/atletas/1/documentos', { auth: true }),
      req('Descargar documento atleta', 'GET', '/atletas/1/documentos/1/download', { auth: true }),
      req('Crear atleta', 'POST', '/atletas', { auth: true, body: { nombre: 'Atleta', primer_apellido: 'Prueba', fecha_nacimiento: '2010-05-15', genero: 'Masculino', cedula: '1-2345-6789', pais: 'Costa Rica' } }),
      req('Actualizar atleta', 'PUT', '/atletas/1', { auth: true, body: { telefono: '7777-7777' } }),
      req('Eliminar atleta', 'DELETE', '/atletas/1', { auth: true }),
    ],
  },
  {
    name: '3. Competiciones',
    item: [
      req('Listar competiciones', 'GET', '/competiciones'),
      req('Competición por ID', 'GET', '/competiciones/1'),
      req('Crear competición', 'POST', '/competiciones', { auth: true, body: { nombre: 'Torneo Regional', fecha_inicio: '2026-06-01', fecha_fin: '2026-06-03' } }),
      req('Inscribir atleta', 'POST', '/competiciones/inscribir-atleta', { auth: true, body: { competicion_id: 1, atleta_id: 1 } }),
    ],
  },
  {
    name: '4. Consultas',
    item: [
      req('Enviar consulta (público)', 'POST', '/consultas', { body: { nombre: 'Visitante', correo: 'visitante@mail.com', mensaje: 'Consulta de prueba' } }),
      req('Listar consultas', 'GET', '/consultas', { auth: true }),
      req('Responder consulta', 'POST', '/consultas/1/responder', { auth: true, body: { respuesta: 'Gracias por contactarnos.' } }),
    ],
  },
  {
    name: '5. Voluntarios',
    item: [
      req('Listar voluntarios', 'GET', '/voluntarios', { auth: true }),
      req('Aprobar voluntario', 'PUT', '/voluntarios/1/aprobar', { auth: true }),
      req('Rechazar voluntario', 'PUT', '/voluntarios/1/rechazar', { auth: true }),
    ],
  },
  {
    name: '6. Entrenadores',
    item: [
      req('Listar entrenadores', 'GET', '/entrenadores', { auth: true }),
      req('Crear entrenador', 'POST', '/entrenadores', { auth: true, body: { nombre: 'Entrenador', primer_apellido: 'Prueba', correo_electronico: 'coach@oe.cr' } }),
    ],
  },
  {
    name: '7. Registros pendientes',
    item: [
      req('Crear registro JSON (sin archivos)', 'POST', '/registros-pendientes', { body: { rol: 'atleta', correoElectronico: 'nuevo@oe.cr', nombre: 'Nuevo' } }),
      req('Listar documentos pendientes', 'GET', '/registros-pendientes/1/documentos', { auth: true }),
      req('Descargar documento pendiente', 'GET', '/registros-pendientes/1/documentos/1/download', { auth: true }),
      req('Listar pendientes', 'GET', '/registros-pendientes', { auth: true }),
      req('Actualizar estado', 'PATCH', '/registros-pendientes/1', { auth: true, body: { estado: 'RECHAZADA' } }),
    ],
  },
  {
    name: '8. Estadísticas y Admin',
    item: [
      req('Stats públicas', 'GET', '/stats/public'),
      req('Stats panel', 'GET', '/stats', { auth: true }),
      req('Gráficos', 'GET', '/stats/charts', { auth: true }),
      req('Admin stats', 'GET', '/admin/stats', { auth: true }),
      req('Admin gráficos', 'GET', '/admin/graficos', { auth: true }),
    ],
  },
  {
    name: '9. Inteligencia artificial',
    item: [
      req('Chat inclusión', 'POST', '/ia/inclusion/chat', { body: { prompt: '¿Qué es Olimpiadas Especiales?' } }),
      req('Analizar salud atleta', 'GET', '/ia/salud/analizar/1'),
      req('OCR certificado', 'POST', '/ia/registro/ocr', { body: { imagenBase64: 'BASE64_AQUI' } }),
    ],
  },
  {
    name: '10. Chat sitio web',
    item: [
      req('Enviar mensajes', 'POST', '/chats', { body: { messages: [{ role: 'user', content: '¿Cómo me inscribo como voluntario?' }] } }),
    ],
  },
  {
    name: '11. Catálogos (auth)',
    item: [
      req('Disciplinas', 'GET', '/disciplinas', { auth: true }),
      req('Programas', 'GET', '/programas', { auth: true }),
      req('Roles', 'GET', '/roles', { auth: true }),
      req('Tutores', 'GET', '/tutores', { auth: true }),
      req('Áreas voluntariado', 'GET', '/voluntarios-areas'),
      req('Configuración', 'GET', '/settings', { auth: true }),
      req('Usuarios (admin)', 'GET', '/usuarios/all', { auth: true }),
    ],
  },
];

const collection = {
  info: {
    _postman_id: '764fcf8c-8c10-449e-b91b-193498877bc9',
    name: 'Olimpiadas Especiales Costa Rica',
    description: 'Colección API v1 — Olimpiadas Especiales Costa Rica. Ver API_ENDPOINTS.md para documentación completa.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: folders,
  variable: [
    { key: 'base_url', value: 'http://localhost:3000', type: 'string' },
    { key: 'token', value: '', type: 'string' },
  ],
};

fs.writeFileSync(OUT, JSON.stringify(collection, null, '\t'));
console.log('Colección generada:', OUT);
