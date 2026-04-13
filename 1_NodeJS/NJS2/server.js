

// --- MÓDULOS NATIVOS ---
const http = require('http');
const fs   = require('fs');
const url  = require('url');
const path = require('path');

// --- PAQUETES NPM ---
const uc = require('upper-case');

// --- MÓDULOS PERSONALIZADOS ---
const timeModule   = require('./modules/timeModule');
const calcModule   = require('./modules/calcModule');
const stringModule = require('./modules/stringModule');

// Configuración
const PORT = 3000;
const HOST = '127.0.0.1';

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const navbarHtml = `
<nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
  <div class="container">
    <a class="navbar-brand fw-bold fs-4" href="/">${uc.upperCase('nj2')}</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="nav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link" href="/">${uc.upperCase('inicio')}</a></li>
        <li class="nav-item"><a class="nav-link" href="/tiempo">${uc.upperCase('tiempo')}</a></li>
        <li class="nav-item"><a class="nav-link" href="/calculos">${uc.upperCase('cálculos')}</a></li>
        <li class="nav-item"><a class="nav-link" href="/strings">${uc.upperCase('strings')}</a></li>
        <li class="nav-item"><a class="nav-link" href="/modulos">${uc.upperCase('módulos')}</a></li>
        <li class="nav-item"><a class="nav-link" href="/acerca">${uc.upperCase('acerca')}</a></li>
      </ul>
    </div>
  </div>
</nav>`;

// ─── SERVIDOR ─────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname  = parsedUrl.pathname;
  const search    = parsedUrl.search || 'ninguno';

  console.log(`[HOST]: ${req.headers.host} | [PATH]: ${pathname} | [QUERY]: ${search} | [METHOD]: ${req.method}`);

  // ── Enrutamiento ────────────────────────────────────────────────────────────
  let fileName = '';
  switch (pathname) {
    case '/':          fileName = 'inicio.html';   break;
    case '/tiempo':    fileName = 'tiempo.html';   break;
    case '/calculos':  fileName = 'calculos.html'; break;
    case '/strings':   fileName = 'strings.html';  break;
    case '/modulos':   fileName = 'modulos.html';  break;
    case '/acerca':    fileName = 'acerca.html';   break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="es" data-bs-theme="dark">
        <head>
          <meta charset="UTF-8" />
          <title>404 | NJ2</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
        </head>
        <body class="bg-dark text-light">
          ${navbarHtml}
          <div class="container text-center py-5">
            <h1 style="font-size:5rem;" class="fw-bold text-danger">404</h1>
            <h4>${uc.upperCase('página no encontrada')}</h4>
            <p class="text-secondary">La ruta <code>${pathname}</code> no existe en este servidor.</p>
            <a href="/" class="btn btn-primary mt-3">${uc.upperCase('volver al inicio')}</a>
          </div>
        </body>
        </html>`);
      return;
  }

  // ── Leer archivo HTML ────────────────────────────────────────────────────────
  const filePath = path.join(__dirname, 'pages', fileName);

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(`Error de lectura: ${filePath}`, err);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Error interno del servidor: no se pudo leer el archivo');
      return;
    }

    // Inyectar navbar en todas las páginas
    let html = data.replace('<menu-placeholder></menu-placeholder>', navbarHtml);

    // ── Inyección dinámica por página ──────────────────────────────────────────

    // ── INICIO (/): hora del servidor + título de sección
    if (fileName === 'inicio.html') {
      html = html.replace('<server-time></server-time>', timeModule.getCurrentTime());
      html = html.replace('<server-section-title></server-section-title>', uc.upperCase('secciones del sitio'));
    }

    // ── TIEMPO (/tiempo): tabla completa de timeModule
    else if (fileName === 'tiempo.html') {
      html = html.replace('<server-page-title></server-page-title>', uc.upperCase('módulo de tiempo'));

      const tiempoHtml = `
        <tr>
          <td><code>getCurrentTime()</code></td>
          <td class="res">${timeModule.getCurrentTime()}</td>
          <td>Hora actual en formato HH:MM:SS</td>
        </tr>
        <tr>
          <td><code>getCurrentDate()</code></td>
          <td class="res">${timeModule.getCurrentDate()}</td>
          <td>Fecha actual en formato DD/MM/AAAA</td>
        </tr>
        <tr>
          <td><code>getDayOfWeek()</code></td>
          <td class="res">${timeModule.getDayOfWeek()}</td>
          <td>Nombre del día de la semana en español</td>
        </tr>
        <tr>
          <td><code>getTimestamp()</code></td>
          <td class="res" style="font-size:0.78rem;font-family:monospace;">${timeModule.getTimestamp()}</td>
          <td>Marca de tiempo ISO 8601</td>
        </tr>
        <tr>
          <td><code>getElapsedSeconds(hace 3 min)</code></td>
          <td class="res">${timeModule.getElapsedSeconds(new Date(Date.now() - 180000))} segundos</td>
          <td>Segundos transcurridos desde una fecha pasada</td>
        </tr>`;
      html = html.replace('<server-tiempo></server-tiempo>', tiempoHtml);
    }

    // ── CÁLCULOS (/calculos): tabla completa de calcModule
    else if (fileName === 'calculos.html') {
      html = html.replace('<server-page-title></server-page-title>', uc.upperCase('módulo de cálculo'));

      const calcHtml = `
        <tr>
          <td><code>add(15, 27)</code></td>
          <td>15 + 27</td>
          <td class="res-num">${calcModule.add(15, 27)}</td>
          <td>Suma de dos números</td>
        </tr>
        <tr>
          <td><code>subtract(100, 38)</code></td>
          <td>100 − 38</td>
          <td class="res-num">${calcModule.subtract(100, 38)}</td>
          <td>Resta de dos números</td>
        </tr>
        <tr>
          <td><code>multiply(9, 8)</code></td>
          <td>9 × 8</td>
          <td class="res-num">${calcModule.multiply(9, 8)}</td>
          <td>Multiplicación de dos números</td>
        </tr>
        <tr>
          <td><code>divide(256, 4)</code></td>
          <td>256 ÷ 4</td>
          <td class="res-num">${calcModule.divide(256, 4)}</td>
          <td>División de dos números</td>
        </tr>
        <tr>
          <td><code>power(2, 10)</code></td>
          <td>2 ^ 10</td>
          <td class="res-num">${calcModule.power(2, 10)}</td>
          <td>Potencia: base elevada a exponente</td>
        </tr>
        <tr>
          <td><code>percentage(75, 200)</code></td>
          <td>75 de 200</td>
          <td class="res-num">${calcModule.percentage(75, 200)}%</td>
          <td>Porcentaje de un valor sobre un total</td>
        </tr>
        <tr>
          <td><code>divide(10, 0)</code></td>
          <td>10 ÷ 0</td>
          <td class="res-err">${calcModule.divide(10, 0)}</td>
          <td>Manejo de error: división por cero</td>
        </tr>`;
      html = html.replace('<server-calc></server-calc>', calcHtml);
    }

    // ── STRINGS (/strings): tabla completa de stringModule
    else if (fileName === 'strings.html') {
      html = html.replace('<server-page-title></server-page-title>', uc.upperCase('módulo de cadenas'));

      const stringsHtml = `
        <tr>
          <td><code>capitalize()</code></td>
          <td>"hola mundo"</td>
          <td class="res">${stringModule.capitalize('hola mundo')}</td>
          <td>Primera letra a mayúscula</td>
        </tr>
        <tr>
          <td><code>reverseString()</code></td>
          <td>"Node.js"</td>
          <td class="res">${stringModule.reverseString('Node.js')}</td>
          <td>Invierte el orden de caracteres</td>
        </tr>
        <tr>
          <td><code>countWords()</code></td>
          <td>"El rápido zorro marrón"</td>
          <td class="res">${stringModule.countWords('El rápido zorro marrón')} palabras</td>
          <td>Cuenta las palabras de la cadena</td>
        </tr>
        <tr>
          <td><code>isPalindrome()</code></td>
          <td>"reconocer"</td>
          <td class="res-true">${stringModule.isPalindrome('reconocer')}</td>
          <td>Verifica si es palíndromo (sí lo es)</td>
        </tr>
        <tr>
          <td><code>isPalindrome()</code></td>
          <td>"hola"</td>
          <td class="res-false">${stringModule.isPalindrome('hola')}</td>
          <td>Verifica si es palíndromo (no lo es)</td>
        </tr>
        <tr>
          <td><code>truncate()</code></td>
          <td>"Aprendiendo Node.js!", 12</td>
          <td class="res">${stringModule.truncate('Aprendiendo Node.js!', 12)}</td>
          <td>Trunca a 12 caracteres con "..."</td>
        </tr>`;
      html = html.replace('<server-strings></server-strings>', stringsHtml);
    }

    // módulos y acerca: contenido estático, solo se inyecta el navbar (ya hecho arriba)

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  });
});

// ─── ERRORES DEL SERVIDOR ─────────────────────────────────────────────────────
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('El puerto 3000 ya está en uso. Detenga el otro servidor e intente de nuevo.');
  } else {
    console.error('Error del servidor:', err.message);
  }
  process.exit(1);
});

// ─── INICIAR ──────────────────────────────────────────────────────────────────
server.listen(PORT, HOST, () => {
  console.log('\n==================================================');
  console.log(`  Servidor NJ2 activo en http://${HOST}:${PORT}`);
  console.log('==================================================\n');
  console.log('  Rutas disponibles:');
  console.log(`  /          → inicio.html`);
  console.log(`  /tiempo    → tiempo.html`);
  console.log(`  /calculos  → calculos.html`);
  console.log(`  /strings   → strings.html`);
  console.log(`  /modulos   → modulos.html`);
  console.log(`  /acerca    → acerca.html`);
  console.log('');
});
