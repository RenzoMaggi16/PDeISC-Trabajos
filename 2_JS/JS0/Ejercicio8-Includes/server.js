const express = require('express');
const path    = require('path');
const app     = express();
const PUERTO  = 3007;

app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/styles',  express.static(path.join(__dirname, 'public', 'styles')));

app.use((req, res, next) => {
  console.log(req.method + ' ' + req.url);
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

const servidor = app.listen(PUERTO, () => {
  console.log('Servidor corriendo en http://localhost:' + PUERTO);
});

servidor.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('Error: el puerto ' + PUERTO + ' ya esta en uso.');
  } else {
    console.log('Error del servidor: ' + err.message);
  }
  process.exit(1);
});
