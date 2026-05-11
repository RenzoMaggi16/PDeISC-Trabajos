const Exportador = (() => {
  /* Genera el contenido de texto formateado basado en el array de números.*/
  const generarContenidoTexto = (array) => {
    const total = array.length;
    const max = Math.max(...array);
    const min = Math.min(...array);
    const suma = array.reduce((acc, curr) => acc + curr, 0);
    const promedio = (suma / total).toFixed(2);

    // Configuración regional argentina (español)
    const opcionesFecha = { 
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    const fechaActual = new Date().toLocaleString('es-AR', opcionesFecha);

    // Construir la lista enumerada
    const listado = array.map((num, i) => `${i + 1}. ${num}`).join('\n');

    return `=== COLECCIÓN DE NÚMEROS ===
Fecha y hora: ${fechaActual}
Total de números: ${total}

Listado:
${listado}

Estadísticas:
- Mínimo: ${min}
- Máximo: ${max}
- Suma total: ${suma}
- Promedio: ${promedio}
`;
  };

  /* Genera la descarga local de un blob para navegadores sin File System Access API.*/
  const descargarConBlob = (contenido, nombre) => {
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* Envía el array al servidor y además descarga el archivo localmente.*/
  const guardarEnServidor = async (array) => {
    try {
      if (array.length === 0) {
        throw new Error("El array está vacío.");
      }

      const contenido = generarContenidoTexto(array);
      
      const fecha = new Date();
      const stringFecha = fecha.toISOString().replace(/:/g, '-').split('.')[0];
      const nombreArchivo = `numeros_${stringFecha}.TXT`;

      // 1. Guardar en el servidor
      const response = await fetch('/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contenido, nombreArchivo })
      });

      const resultado = await response.json();
      
      if (!response.ok) {
        throw new Error(resultado.error || 'Error desconocido al guardar en el servidor.');
      }

      // 2. Descarga Local
      try {
        if (window.showSaveFilePicker) {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: nombreArchivo,
            types: [{
              description: 'Archivo de Texto',
              accept: { 'text/plain': ['.TXT', '.txt'] },
            }],
          });
          const writable = await fileHandle.createWritable();
          await writable.write(contenido);
          await writable.close();
        } else {
          descargarConBlob(contenido, nombreArchivo);
        }
      } catch (err) {
        // Ignorar AbortError (usuario cancela)
        if (err.name !== 'AbortError') {
          console.error("Error al usar showSaveFilePicker, intentando fallback:", err);
          descargarConBlob(contenido, nombreArchivo);
        }
      }

      return resultado; // { exito: true, ruta: '...' }

    } catch (error) {
      console.error("[Exportador Error]:", error);
      return { exito: false, error: error.message };
    }
  };

  return {
    guardarEnServidor
  };
})();
