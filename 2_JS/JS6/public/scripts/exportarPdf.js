// Genera y descarga un PDF con el resultado de la partida usando jsPDF (CDN).
// Es 100% del lado del cliente: no recarga la página ni usa el servidor.

function descargarPdf(datos) {
  // jsPDF se expone en window.jspdf al cargar por CDN.
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Título.
  doc.setFontSize(22);
  doc.text('Ahorcado - Resultado', 20, 25);

  // Línea horizontal debajo del título.
  doc.setLineWidth(0.5);
  doc.line(20, 30, 190, 30);

  // Datos de la partida.
  doc.setFontSize(14);
  doc.text(`Jugador: ${datos.nombre}`, 20, 45);
  doc.text(`Puntos: ${datos.puntos}`, 20, 57);
  doc.text(`Tiempo: ${datos.tiempo} segundos`, 20, 69);
  doc.text(`Fecha: ${datos.fecha}`, 20, 81);

  // Pie de página.
  doc.setFontSize(10);
  doc.text('Generado desde el juego del Ahorcado (JS6).', 20, 100);

  doc.save('puntaje.pdf');
}

window.exportarPdf = { descargarPdf };
