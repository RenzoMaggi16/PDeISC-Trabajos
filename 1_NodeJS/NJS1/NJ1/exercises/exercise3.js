export function ejecutarEjercicio3() {
  const sumar = (a, b) => a + b;
  const restar = (a, b) => a - b;
  const multiplicar = (a, b) => a * b;
  const dividir = (a, b) => a / b;

  try {
    console.log(`Suma:           4 + 5  = ${sumar(4, 5)}`);
    console.log(`Resta:          3 - 6  = ${restar(3, 6)}`);
    console.log(`Multiplicacion: 2 × 7  = ${multiplicar(2, 7)}`);
    console.log(`Division:       20 / 4 = ${dividir(20, 4)}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
