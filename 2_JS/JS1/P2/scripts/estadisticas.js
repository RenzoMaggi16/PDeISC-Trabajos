document.addEventListener('DOMContentLoaded', () => {
  const elTotal = document.getElementById('stat-total');
  const elPromedio = document.getElementById('stat-promedio');
  const elRango = document.getElementById('stat-rango');
  const elCategoria = document.getElementById('stat-categoria');

  const formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

  /* Lee el array principal, calcula promedios, rangos y frecuencias y pinta el DOM.*/
  const actualizarPanel = () => {
    const items = window.Almacenamiento.obtenerTodos();
    const count = items.length;

    if (count === 0) {
      elTotal.textContent = '0';
      elPromedio.textContent = '$ 0.00';
      elRango.textContent = 'Mín: $0 - Máx: $0';
      elCategoria.textContent = '-';
      return;
    }

    // 1. Total Ítems
    elTotal.textContent = count;

    // 2. Precio Promedio
    const sumatoria = items.reduce((acc, item) => acc + item.precio, 0);
    const promedio = sumatoria / count;
    elPromedio.textContent = formatter.format(promedio);

    // 3. Rango de Precios (Mín / Máx)
    const ordenados = window.Almacenamiento.obtenerOrdenado();
    const min = ordenados[0].precio;
    const max = ordenados[ordenados.length - 1].precio;
    elRango.textContent = `Mín: ${formatter.format(min)} - Máx: ${formatter.format(max)}`;

    // 4. Categoría Más Frecuente
    const frecuencias = {};
    items.forEach(item => {
      frecuencias[item.categoria] = (frecuencias[item.categoria] || 0) + 1;
    });

    let maxCat = '-';
    let maxFreq = 0;
    for (const [cat, freq] of Object.entries(frecuencias)) {
      if (freq > maxFreq) {
        maxFreq = freq;
        maxCat = cat;
      }
    }
    elCategoria.textContent = maxCat;
  };

  // Export to window so formulario.js and renderizado.js can call it
  window.Estadisticas = {
    actualizarPanel
  };
});
