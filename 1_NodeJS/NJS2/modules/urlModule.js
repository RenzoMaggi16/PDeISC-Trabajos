// urlModule.js - Wrapper del módulo URL nativo de Node.js
const url = require('url');

// Analiza una URL y devuelve sus partes
function parseUrl(rawUrl) {
  const parsed = url.parse(rawUrl, true);
  return {
    href: parsed.href,
    protocol: parsed.protocol || '',
    host: parsed.host || '',
    hostname: parsed.hostname || '',
    port: parsed.port || '',
    pathname: parsed.pathname || '',
    search: parsed.search || '',
    hash: parsed.hash || '',
    query: parsed.query || {}
  };
}

// Obtiene los parámetros de consulta como objeto
function getQueryParams(rawUrl) {
  const parsed = url.parse(rawUrl, true);
  return parsed.query;
}

// Verifica si una URL tiene formato válido
function isValidUrl(rawUrl) {
  try {
    new URL(rawUrl);
    return true;
  } catch {
    return false;
  }
}

module.exports = { parseUrl, getQueryParams, isValidUrl };
