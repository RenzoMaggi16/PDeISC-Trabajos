// Funciones de validacion en JavaScript para entradas de la API REST

// Valida formato estandar de direccion de correo electronico
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Valida longitud y robustez minima de la contrasenia (minimo 6 caracteres, al menos una letra y un numero)
export function isStrongPassword(password) {
  if (typeof password !== 'string') return false;
  if (password.length < 6) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
}

// Valida que el nombre no este vacio y tenga al menos 2 caracteres
export function isValidName(nombre) {
  if (typeof nombre !== 'string') return false;
  return nombre.trim().length >= 2;
}

// Valida formato opcional de fecha AAAA-MM-DD
export function isValidDateString(dateStr) {
  if (!dateStr) return true; // Es opcional
  if (typeof dateStr !== 'string') return false;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  const parsed = new Date(dateStr);
  return !isNaN(parsed.getTime());
}
