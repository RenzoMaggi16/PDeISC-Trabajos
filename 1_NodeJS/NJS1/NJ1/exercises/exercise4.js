import { sumar, restar, multiplicar, dividir } from './calculos.js';

export function ejecutarEjercicio4() {
  try {
    console.log(`Suma:           5 + 3   = ${sumar(5, 3)}`);
    console.log(`Resta:          8 - 6   = ${restar(8, 6)}`);
    console.log(`Multiplicacion: 3 × 11  = ${multiplicar(3, 11)}`);
    console.log(`Division:       30 / 5  = ${dividir(30, 5)}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
