const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Log middleware para todas las peticiones
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// GET / - Servir SPA
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'index.html'));
});

// POST /guardar-resultado - Guarda el resultado del filtrado en galeria/
router.post('/guardar-resultado', async (req, res) => {
  try {
    const { nombreArchivo, contenido } = req.body;
    
    if (!nombreArchivo || !contenido) {
      return res.status(400).json({ exito: false, error: 'Faltan parámetros: nombreArchivo y/o contenido.' });
    }

    // Sanitización básica para evitar path traversal
    const nombreLimpio = path.basename(nombreArchivo);
    
    // Asegurar que termine en .TXT o .txt para consistencia
    const nombreFinal = nombreLimpio.toLowerCase().endsWith('.txt') ? nombreLimpio : `${nombreLimpio}.TXT`;

    const rutaDirectorio = path.join(__dirname, '..', 'galeria');
    const rutaArchivo = path.join(rutaDirectorio, nombreFinal);

    await fs.promises.writeFile(rutaArchivo, contenido, 'utf-8');

    res.json({ exito: true, ruta: `galeria/${nombreFinal}` });
  } catch (err) {
    console.error('Error al guardar archivo:', err);
    res.status(500).json({ exito: false, error: 'Ocurrió un error al guardar el archivo en el servidor.' });
  }
});

module.exports = router;
