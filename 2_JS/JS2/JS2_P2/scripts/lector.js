const Lector = (() => {

  /**Extrae todos los valores numéricos de un string de texto.*/
  const extraerNumeros = (texto) => {
    const lineas = texto.split('\n');
    
    const numeros = lineas
      // 1. Filtrar líneas que coinciden con el patrón "dígitos. número"
      // Ej: "1. 525" o "10. -3.14"
      .filter(linea => /^\d+\.\s+-?\d+(\.\d+)?$/.test(linea.trim()))
      // 2. Extraer el valor numérico
      .map(linea => {
        // Separamos por el primer espacio. Ej "1. 525" -> ["1.", "525"]
        const partes = linea.trim().split(/\s+/);
        // El número está en la segunda parte (o desde el primer espacio en adelante)
        // Por robustez, si hay múltiples espacios, join del resto y parsear
        const stringNumero = partes.slice(1).join('');
        return parseFloat(stringNumero);
      })
      // Asegurar que no pasen NaN por algún motivo extraño
      .filter(num => !isNaN(num));

    return numeros;
  };

  /** Lee un archivo .txt de forma asincrónica. */
  const leerArchivoTxt = (archivo) => {
    return new Promise((resolve, reject) => {
      // Validar tipo o extensión
      if (archivo.type !== 'text/plain' && !archivo.name.toLowerCase().endsWith('.txt')) {
        return reject(new Error('El archivo seleccionado no es un documento de texto (.txt).'));
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const crudo = e.target.result;
        const numeros = extraerNumeros(crudo);
        resolve({ numeros, crudo });
      };

      reader.onerror = () => {
        reject(new Error('Ocurrió un error al intentar leer el archivo en el navegador.'));
      };

      reader.readAsText(archivo);
    });
  };

  return {
    leerArchivoTxt,
    extraerNumeros
  };
})();
