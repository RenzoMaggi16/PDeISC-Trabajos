const Exportador = (() => {

  /** Genera el contenido formateado del archivo resultado.*/
  const generarContenidoTexto = (nombreArchivoOrigen, aprobados, descartados, estadisticas) => {
    const opcionesFecha = { 
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    const fechaActual = new Date().toLocaleString('es-AR', opcionesFecha);

    const formatLista = (lista) => {
      if (lista.length === 0) return "(Ninguno)";
      return lista.map((num, i) => `${i + 1}. ${num}`).join('\n');
    };

    const total = estadisticas.totalAprobados + estadisticas.totalDescartados;

    return `=== RESULTADO DEL FILTRADO ===
Fecha y hora: ${fechaActual}
Archivo procesado: ${nombreArchivoOrigen}

--- ESTADÍSTICAS ---
Total de números en el archivo: ${total}
Números útiles (primer = último dígito): ${estadisticas.totalAprobados}
Números descartados: ${estadisticas.totalDescartados}
Porcentaje de utilidad: ${estadisticas.porcentajeUtil}%

--- NÚMEROS ÚTILES (orden ascendente) ---
${formatLista(aprobados)}

--- NÚMEROS DESCARTADOS ---
${formatLista(descartados)}
`;
  };

  /** Fallback para navegadores que no soportan showSaveFilePicker. */
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

  /** Envía los datos al servidor y genera la descarga en el cliente. */
  const guardarResultado = async (nombreOrigen, aprobados, descartados, estadisticas) => {
    try {
      const contenido = generarContenidoTexto(nombreOrigen, aprobados, descartados, estadisticas);
      
      const fecha = new Date();
      const stringFecha = fecha.toISOString().replace(/:/g, '-').split('.')[0];
      const nombreArchivo = `resultado_filtrado_${stringFecha}.TXT`;

      // 1. Guardar en Servidor
      const response = await fetch('/guardar-resultado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreArchivo, contenido })
      });

      const resultado = await response.json();
      
      if (!response.ok) {
        throw new Error(resultado.error || 'Error del servidor.');
      }

      // 2. Descarga Local (Doble guardado como en P1)
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
        if (err.name !== 'AbortError') {
          console.warn("Fallo showSaveFilePicker, intentando blob fallback:", err);
          descargarConBlob(contenido, nombreArchivo);
        }
      }

      return resultado; // { exito: true, ruta: ... }

    } catch (error) {
      console.error("[Exportador Error]:", error);
      return { exito: false, error: error.message };
    }
  };

  return { guardarResultado };
})();
