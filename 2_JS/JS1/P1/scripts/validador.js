const REGLAS = {
  nombre: {
    validar: (valor) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim()) && valor.trim().length >= 3,
    mensaje: "El nombre debe tener al menos 3 letras y no contener números."
  },
  apellido: {
    validar: (valor) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim()) && valor.trim().length >= 3,
    mensaje: "El apellido debe tener al menos 3 letras y no contener números."
  },
  email: {
    validar: (valor) => /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo|outlook)\.(com|net|org|ar)$/i.test(valor.trim()),
    mensaje: "Debe ser un email válido (ej: gmail.com, hotmail.ar, etc)."
  },
  celular: {
    validar: (valor) => /^[1-9]\d{9}$/.test(valor.trim()),
    mensaje: "Debe tener 10 dígitos, sin 0 inicial ni 15."
  },
  dni: {
    validar: (valor) => /^\d{7,8}$/.test(valor.trim()),
    mensaje: "El DNI debe contener entre 7 y 8 números exactos."
  },
  ingresos: {
    validar: (valor) => {
      const num = parseInt(valor, 10);
      return !isNaN(num) && num >= 500000 && /^\d+$/.test(valor);
    },
    mensaje: "Los ingresos deben ser de al menos $500,000."
  },
  fechaNacimiento: {
    validar: (valor) => {
      if (!valor) return false;
      const fecha = new Date(valor);
      if (isNaN(fecha.getTime())) return false;
      
      const hoy = new Date();
      let edad = hoy.getFullYear() - fecha.getFullYear();
      const mes = hoy.getMonth() - fecha.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
        edad--;
      }
      return edad >= 18 && edad <= 99;
    },
    mensaje: "Debe ser mayor de 18 años y menor de 99."
  }
};

// Valida un valor específico contra una regla por nombre de campo.
const validarCampo = (campoName, valor) => {
  const regla = REGLAS[campoName];
  if (!regla) return { isValid: true, mensaje: "" };

  const isValid = regla.validar(valor);
  return { isValid, mensaje: isValid ? "" : regla.mensaje };
};
