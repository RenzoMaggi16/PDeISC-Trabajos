// calcModule.js - Funciones de cálculo matemático

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) return 'Error: no se puede dividir por cero';
  return a / b;
}

function power(base, exp) {
  return base ** exp;
}

function percentage(value, total) {
  if (total === 0) return 'Error: el total no puede ser cero';
  return Math.round((value / total) * 100 * 100) / 100;
}

module.exports = { add, subtract, multiply, divide, power, percentage };
