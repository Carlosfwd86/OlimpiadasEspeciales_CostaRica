/**
 * Smoke test rápido de API tras constraints CHECK.
 * Requiere servidor en marcha: npm run dev
 */
const http = require('http');

const BASE = process.env.API_BASE || 'http://127.0.0.1:3000';

function request(method, path, body, cookie = '') {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(cookie ? { Cookie: cookie } : {}),
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => { raw += c; });
        res.on('end', () => {
          let json = null;
          try { json = JSON.parse(raw); } catch { /* */ }
          resolve({ status: res.statusCode, headers: res.headers, json, raw });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function getCookie(setCookie) {
  if (!setCookie) return '';
  const arr = Array.isArray(setCookie) ? setCookie : [setCookie];
  return arr.map((c) => c.split(';')[0]).join('; ');
}

(async () => {
  const results = [];

  try {
    const login = await request('POST', '/api/v1/auth/login', {
      correo_electronico: 'admin@olimpiadas.cr',
      password: 'Admin1234!',
    });
    const cookie = getCookie(login.headers['set-cookie']);
    const loginOk = login.status === 200 && login.json?.data?.usuario;
    results.push(['Login admin', loginOk ? 'OK' : `FAIL ${login.status}`]);

    const badComp = await request(
      'POST',
      '/api/v1/competiciones',
      {
        nombre: 'Test Invalido',
        fecha_inicio: '2026-06-01',
        fecha_fin: '2026-01-01',
      },
      cookie
    );
    results.push([
      'Competición fechas inválidas → 400',
      badComp.status === 400 ? 'OK' : `FAIL ${badComp.status}`,
    ]);

    const me = await request('GET', '/api/v1/auth/me', null, cookie);
    results.push(['GET /auth/me', me.status === 200 ? 'OK' : `FAIL ${me.status}`]);
  } catch (err) {
    results.push(['Conexión API', `FAIL - ¿Servidor en ${BASE}? ${err.message}`]);
  }

  console.log('=== Smoke test API ===');
  results.forEach(([name, status]) => console.log(`${status === 'OK' ? '✓' : '✗'} ${name}: ${status}`));
  const failed = results.filter((r) => r[1] !== 'OK').length;
  process.exit(failed > 0 ? 1 : 0);
})();
