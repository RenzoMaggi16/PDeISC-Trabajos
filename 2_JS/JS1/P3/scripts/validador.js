// Reglas por campo
const REGLAS = {
  nombre: {
    validar: (v) => v.trim().length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v.trim()),
    mensaje: "Mínimo 3 letras, sin números ni caracteres especiales."
  },
  apellido: {
    validar: (v) => v.trim().length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v.trim()),
    mensaje: "Mínimo 3 letras, sin números ni caracteres especiales."
  },
  edad: {
    validar: (v) => {
      const n = parseInt(v, 10);
      return !isNaN(n) && n >= 0 && n <= 120 && /^\d+$/.test(v);
    },
    mensaje: "Debe ser un número entero entre 0 y 120."
  },
  fechaNacimiento: {
    validar: (v) => {
      if (!v) return false;
      const date = new Date(v);
      const now = new Date();
      return !isNaN(date.getTime()) && date <= now;
    },
    mensaje: "Fecha inválida o no puede ser futura."
  },
  documento: {
    validar: (v) => /^\d{7,8}$/.test(v.trim()),
    mensaje: "El documento debe contener entre 7 y 8 números exactos."
  },
  estadoCivil: {
    validar: (v) => v !== "" && v !== null,
    mensaje: "Debe seleccionar un estado civil."
  },
  nacionalidad: {
    validar: (v) => v.trim().length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v.trim()),
    mensaje: "Mínimo 3 letras, sin números."
  },
  telefono: {
    // Permite un + al inicio opcional, y luego entre 8 y 15 dígitos
    validar: (v) => /^\+?\d{8,15}$/.test(v.trim()),
    mensaje: "Debe contener entre 8 y 15 números (puede incluir '+' inicial)."
  },
  mail: {
    validar: (v) => {
      const regex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo|outlook|live|icloud)\.(com|net|org|ar|es|io)$/i;
      return regex.test(v.trim());
    },
    mensaje: "Debe ser un email válido (ej: gmail.com, hotmail.ar, etc)."
  },
  cantidadHijos: {
    validar: (v) => {
      const n = parseInt(v, 10);
      return !isNaN(n) && n >= 1 && n <= 20 && /^\d+$/.test(v);
    },
    mensaje: "Si tiene hijos, la cantidad debe ser entre 1 y 20."
  }
};

/* Valida un campo simple según las reglas definidas.*/
const validarCampo = (campoName, valor) => {
  const regla = REGLAS[campoName];
  if (!regla) return { esValido: true, mensaje: "" };

  const esValido = regla.validar(valor);
  return { esValido, mensaje: esValido ? "" : regla.mensaje };
};

/* Validación cruzada: Comprueba que la edad ingresada corresponda aprox. a la fecha de nacimiento (±1 año de tolerancia)*/
const validarEdadYFecha = (edadStr, fechaStr) => {
  if (!edadStr || !fechaStr) return { esValido: true, mensaje: "" }; 
  
  const edadIngresada = parseInt(edadStr, 10);
  const fechaNac = new Date(fechaStr);
  const hoy = new Date();
  
  if (isNaN(edadIngresada) || isNaN(fechaNac.getTime())) return { esValido: false, mensaje: "Datos inválidos." };

  let edadCalculada = hoy.getFullYear() - fechaNac.getFullYear();
  const m = hoy.getMonth() - fechaNac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
    edadCalculada--;
  }

  // Tolerancia de ±1 año para evitar bloqueos por husos horarios o años bisiestos edge cases
  const diferencia = Math.abs(edadIngresada - edadCalculada);
  
  if (diferencia > 1) {
    return { esValido: false, mensaje: "La edad no coincide con la fecha de nacimiento ingresada." };
  }

  return { esValido: true, mensaje: "" };
};

window.Validador = {
  validarCampo,
  validarEdadYFecha
};
