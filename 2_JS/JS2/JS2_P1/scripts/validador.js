
const Validador = (() => {
  /** Verifica si el string representa un número entero o decimal válido.*/
  const esNumeroValido = (valor) => {
    // Si el valor está vacío después de trim, no es número válido (evita que "" se pase a 0)
    if (!valor || valor.trim() === '') return false;
    
    // Parseo estricto
    const num = Number(valor);
    return !isNaN(num) && isFinite(num);
  };

  /** Verifica si el número ya existe en el array actual, permitiendo excluir un índice (para modificaciones).*/
  const esDuplicado = (numero, array, indiceAExcluir = -1) => {
    return array.some((num, i) => num === numero && i !== indiceAExcluir);
  };

  /** Verifica si se alcanzó el límite máximo de 20 números.*/
  const limiteAlcanzado = (array) => {
    return array.length >= 20;
  };

  /** Verifica si se alcanzó el mínimo requerido de 10 números.*/
  const minimoAlcanzado = (array) => {
    return array.length >= 10;
  };

  /* Valida un valor bruto contra las reglas y el estado actual del array.*/
  const validarEntrada = (valor, arrayActual, indiceAExcluir = -1) => {
    if (!valor || valor.trim() === '') {
      return { esValido: false, mensaje: "Por favor ingresá un número." };
    }

    if (!esNumeroValido(valor)) {
      return { esValido: false, mensaje: "El valor ingresado no es un número válido." };
    }

    const numeroParsed = Number(valor);

    if (esDuplicado(numeroParsed, arrayActual, indiceAExcluir)) {
      return { esValido: false, mensaje: "Ese número ya fue ingresado. Ingresá uno diferente." };
    }

    // Solo comprobar límite si es una nueva inserción
    if (indiceAExcluir === -1 && limiteAlcanzado(arrayActual)) {
      return { esValido: false, mensaje: "Ya alcanzaste el máximo de 20 números." };
    }

    return { esValido: true, mensaje: "" };
  };

  return {
    validarEntrada,
    esNumeroValido,
    esDuplicado,
    limiteAlcanzado,
    minimoAlcanzado
  };
})();
