
const Filtrador = (() => {

  /**Verifica si el primer y último dígito de un número son iguales.*/
  const primerYUltimoIguales = (numero) => {
    // Convertir a string absoluto y quitar separador decimal
    // Ej: -3.003 -> "3003", 525 -> "525"
    const cadena = numero.toString().replace('-', '').replace('.', '');
    
    // Si la cadena está vacía (por ej si era solo un punto, aunque improbable), false.
    if (cadena.length === 0) return false;
    
    // Un solo dígito siempre pasa
    if (cadena.length === 1) return true;

    return cadena[0] === cadena[cadena.length - 1];
  };

  /* Filtra un array de números en dos grupos según la regla de los dígitos.*/
  const filtrarNumeros = (numeros) => {
    const aprobados = numeros.filter(num => primerYUltimoIguales(num));
    const descartados = numeros.filter(num => !primerYUltimoIguales(num));
    
    return { aprobados, descartados };
  };

  /*Ordena un array de números en orden ascendente sin mutar el original.*/
  const ordenarAscendente = (numeros) => {
    return [...numeros].sort((a, b) => a - b);
  };

  /*Calcula el porcentaje de útiles y las cantidades totales.*/
  const calcularEstadisticas = (aprobados, descartados) => {
    const totalAprobados = aprobados.length;
    const totalDescartados = descartados.length;
    const total = totalAprobados + totalDescartados;
    
    let porcentajeUtil = "0.00";
    if (total > 0) {
      porcentajeUtil = ((totalAprobados / total) * 100).toFixed(2);
    }

    return {
      totalAprobados,
      totalDescartados,
      porcentajeUtil
    };
  };

  return {
    primerYUltimoIguales,
    filtrarNumeros,
    ordenarAscendente,
    calcularEstadisticas
  };
})();
