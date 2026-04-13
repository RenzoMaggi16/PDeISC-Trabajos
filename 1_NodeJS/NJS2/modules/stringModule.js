// stringModule.js - Funciones de manipulación de cadenas

// Capitaliza la primera letra de una cadena
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Invierte una cadena
function reverseString(str) {
  return str.split('').reverse().join('');
}

// Cuenta las palabras en una cadena
function countWords(str) {
  return str.trim().split(/\s+/).length;
}

// Verifica si una cadena es un palíndromo
function isPalindrome(str) {
  const limpio = str.toLowerCase().replace(/\s+/g, '');
  return limpio === limpio.split('').reverse().join('');
}

// Trunca una cadena a una longitud máxima
function truncate(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

module.exports = { capitalize, reverseString, countWords, isPalindrome, truncate };
