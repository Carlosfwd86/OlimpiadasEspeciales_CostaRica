/**
 * Smoke test: documentos cifrados (registros pendientes).
 * Requiere: npm run dev y DOCUMENT_ENCRYPTION_KEY en .env
 *
 * Uso: node scripts/smoke-documents-api.js
 */
require('dotenv').config();
const { Blob } = require('buffer');

const BASE = process.env.API_BASE || 'http://127.0.0.1:3000';
const ADMIN_EMAIL = process.env.SMOKE_ADMIN_EMAIL || 'admin@olimpiadas.cr';
const ADMIN_PASS = process.env.SMOKE_ADMIN_PASSWORD || 'Admin1234!';

async function loginAdmin() {
  const res = await fetch(`${BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo_electronico: ADMIN_EMAIL, password: ADMIN_PASS }),
  });
  const json = await res.json().catch(() => ({}));
  const token = json.data?.token || json.token;
  if (!res.ok || !token) {
    throw new Error(`Login falló (${res.status}): ${JSON.stringify(json)}`);
  }
  return token;
}

async function postRegistroConArchivo() {
  const datos = {
    rol: 'voluntario',
    nombre: 'Smoke Test Docs',
    correoElectronico: `smoke.docs.${Date.now()}@oe.cr`,
    email: `smoke.docs.${Date.now()}@oe.cr`,
    telefono: '8888-0000',
    fechaRegistro: new Date().toISOString(),
  };

  const form = new FormData();
  form.append('datos', JSON.stringify(datos));
  const pdfBytes = Buffer.from('%PDF-1.4 smoke test documento cifrado');
  form.append('cedula', new Blob([pdfBytes], { type: 'application/pdf' }), 'cedula-smoke.pdf');

  const res = await fetch(`${BASE}/api/v1/registros-pendientes`, {
    method: 'POST',
    body: form,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`POST registro (${res.status}): ${JSON.stringify(json)}`);
  }
  const registroId = json.data?.id;
  const docs = json.data?.documentos || [];
  if (!registroId) throw new Error('Sin id de registro en respuesta');
  if (!docs.length) throw new Error('No se guardaron documentos en el registro');
  return { registroId, docId: docs[0].id, token: null };
}

async function listAndDownload(registroId, docId, token) {
  const listRes = await fetch(`${BASE}/api/v1/registros-pendientes/${registroId}/documentos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const listJson = await listRes.json().catch(() => ({}));
  if (!listRes.ok || !listJson.data?.length) {
    throw new Error(`Listar documentos falló (${listRes.status})`);
  }

  const dlRes = await fetch(
    `${BASE}/api/v1/registros-pendientes/${registroId}/documentos/${docId}/download`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!dlRes.ok) {
    throw new Error(`Descarga falló (${dlRes.status})`);
  }
  const buf = Buffer.from(await dlRes.arrayBuffer());
  if (buf.length < 10) throw new Error('Archivo descargado vacío o corrupto');
  return buf;
}

async function aprobarSinBorrarDocs(registroId, token) {
  const patchRes = await fetch(`${BASE}/api/v1/registros-pendientes/${registroId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ estado: 'APROBADA' }),
  });
  if (!patchRes.ok) {
    const j = await patchRes.json().catch(() => ({}));
    throw new Error(`PATCH APROBADA falló (${patchRes.status}): ${JSON.stringify(j)}`);
  }

  const listRes = await fetch(`${BASE}/api/v1/registros-pendientes/${registroId}/documentos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const listJson = await listRes.json().catch(() => ({}));
  if (!listRes.ok || !listJson.data?.length) {
    throw new Error('Tras aprobar, los documentos ya no están disponibles');
  }
}

(async () => {
  const results = [];
  try {
    const token = await loginAdmin();
    results.push(['Login admin', 'OK']);

    const { registroId, docId } = await postRegistroConArchivo();
    results.push(['POST registro + archivo cifrado', 'OK']);

    await listAndDownload(registroId, docId, token);
    results.push(['Listar y descargar documento', 'OK']);

    await aprobarSinBorrarDocs(registroId, token);
    results.push(['Aprobar conservando documentos', 'OK']);
  } catch (err) {
    results.push(['Error', err.message]);
  }

  console.log('=== Smoke documentos cifrados ===');
  results.forEach(([name, status]) => {
    console.log(status === 'OK' ? `✓ ${name}` : `✗ ${name}: ${status}`);
  });

  const failed = results.some(([, s]) => s !== 'OK');
  process.exit(failed ? 1 : 0);
})();
