const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// GET /
// Sirve la página principal de la SPA (index.html).
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'index.html'));
});

// POST /guardar
// Recibe los datos del array y el nombre del archivo para generar y guardar el .txt en galeria/
router.post('/guardar', (req, res) => {
  try {
    const { contenido, nombreArchivo } = req.body;

    if (!contenido || !nombreArchivo) {
      return res.status(400).json({ 
        exito: false, 
        error: 'Faltan datos requeridos (contenido o nombreArchivo).' 
      });
    }

    // Sanitización básica del nombre para evitar path traversal
    const nombreLimpio = path.basename(nombreArchivo);
    
    // Asegurar que termine en .txt o .TXT
    const nombreFinal = nombreLimpio.toLowerCase().endsWith('.txt') ? nombreLimpio : `${nombreLimpio}`;

    const rutaDirectorio = path.join(__dirname, '..', 'galeria');
    const rutaArchivo = path.join(rutaDirectorio, nombreFinal);

    // Guardado sincrónico del archivo
    fs.writeFileSync(rutaArchivo, contenido, 'utf-8');

    // Devolver éxito con la ruta relativa
    res.json({
      exito: true,
      ruta: `galeria/${nombreFinal}`
    });

  } catch (error) {
    console.error(`[ERROR] en /guardar: ${error.message}`);
    res.status(500).json({ 
      exito: false, 
      error: 'Hubo un error al guardar el archivo en el servidor.' 
    });
  }
});

module.exports = router;
