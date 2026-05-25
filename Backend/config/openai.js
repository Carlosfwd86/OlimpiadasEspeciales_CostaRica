const path = require('path');
const { OpenAI } = require('openai');

// Asegurar carga de .env desde la carpeta Backend (aunque el módulo se importe antes que app.js)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

let client = null;

/**
 * Cliente OpenAI con inicialización perezosa.
 * Evita que openai quede null si OPENAI_API_KEY se cargó después del primer require.
 */
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  if (!client) {
    client = new OpenAI({ apiKey });
  }
  return client;
}

function isOpenAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

module.exports = { getOpenAIClient, isOpenAIConfigured };
