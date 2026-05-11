const express = require('express');
const path = require('path');
const fs = require('fs');
const router = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para parsear JSON
app.use(express.json());

// Servir estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Rutas
app.use('/', router);

// Configuración inicial de directorio galeria/
const initDir = () => {
  const dirPath = path.join(__dirname, 'galeria');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log('✅ Directorio "galeria" creado exitosamente.');
  }
};

// Iniciar servidor
app.listen(PORT, (err) => {
  if (err) {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ El puerto ${PORT} está en uso. Por favor, libéralo o intenta con otro puerto.`);
    } else {
      console.error(`❌ Error al iniciar el servidor:`, err);
    }
    process.exit(1);
  }
  
  initDir();
  console.log(`🚀 Servidor (JS2 Proyecto 2) corriendo en http://localhost:${PORT}`);
});
