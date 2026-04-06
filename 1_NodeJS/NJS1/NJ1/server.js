import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ejecutarEjercicio1 } from './exercises/exercise1.js';
import { ejecutarEjercicio2 } from './exercises/exercise2.js';
import { ejecutarEjercicio3 } from './exercises/exercise3.js';
import { ejecutarEjercicio4 } from './exercises/exercise4.js';

console.log("Hola mundo");

console.log("\n--- Ejercicio 1 ---");
ejecutarEjercicio1();

console.log("\n--- Ejercicio 2 ---");
ejecutarEjercicio2();

console.log("\n--- Ejercicio 3 ---");
ejecutarEjercicio3();

console.log("\n--- Ejercicio 4 ---");
ejecutarEjercicio4();

const server = createServer(async (req, res) => {
  try {
    if (req.url === '/style.css') {
      const cssPath = join(process.cwd(), 'public', 'style.css');
      const css = await readFile(cssPath, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
      res.end(css);
      return;
    }

    const htmlPath = join(process.cwd(), 'public', 'index.html');
    const html = await readFile(htmlPath, 'utf-8');
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (error) {
    console.error(`Error serving file: ${error.message}`);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port 3000 is already in use.`);
  } else {
    console.error(`\n❌ Server error: ${err.message}`);
  }
  process.exit(1);
});

server.listen(3000, '127.0.0.1', () => {
  console.log("Listening on http://127.0.0.1:3000");
});
