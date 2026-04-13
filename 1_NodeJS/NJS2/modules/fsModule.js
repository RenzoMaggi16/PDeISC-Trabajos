// fsModule.js - Wrapper del módulo File System nativo de Node.js
const fs = require('fs');
const path = require('path');

// Lee un archivo de texto (síncrono, simple para principiantes)
function readTextFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

// Escribe contenido en un archivo
function writeTextFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8');
}

// Añade una línea a un archivo
function appendToFile(filePath, line) {
  fs.appendFileSync(filePath, line + '\n', 'utf-8');
}

// Devuelve información básica de un archivo
function getFileInfo(filePath) {
  const rutaAbsoluta = path.resolve(filePath);
  const stats = fs.statSync(rutaAbsoluta);
  return {
    nombre: path.basename(rutaAbsoluta),
    rutaAbsoluta: rutaAbsoluta,
    tamanoBytes: stats.size,
    tamanoKB: (stats.size / 1024).toFixed(2)
  };
}

module.exports = { readTextFile, writeTextFile, appendToFile, getFileInfo };
