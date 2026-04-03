const fs = require('fs');
const path = require('path');

const indexPath = "c:/Users/renzo/Downloads/Noticias-HTML-CSS---01-4f09226cb6127ff5f6ea64a6a0196d2efb45fd68/Noticias-HTML-CSS---01-4f09226cb6127ff5f6ea64a6a0196d2efb45fd68/index.html";
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Add app.js
html = html.replace(
  '<link rel="icon" type="image/png" href="images/favicon.png" />\r\n  </head>',
  '<link rel="icon" type="image/png" href="images/favicon.png" />\r\n    <script src="app.js" defer></script>\r\n  </head>'
);

// Fallback for CRLF / LF variations
html = html.replace(/<link rel="icon"[^>]+>\r?\n\s*<\/head>/, '<link rel="icon" type="image/png" href="images/favicon.png" />\n    <script src="app.js" defer></script>\n  </head>');


// 2. Add nav-toggle button
html = html.replace(
  '<div class="container">\r\n          <ul class="nav__list">',
  `<div class="container nav-container">\r\n          <button id="nav-toggle" class="nav-toggle" aria-label="Abrir men&uacute;">\r\n            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>\r\n          </button>\r\n          <ul class="nav__list">`
);
html = html.replace(
  /<div class="container">\s*<ul class="nav__list">/,
  `<div class="container nav-container">\n          <button id="nav-toggle" class="nav-toggle" aria-label="Abrir menú">\n            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>\n          </button>\n          <ul class="nav__list">`
);


// 3. Add #main-view wrapper
html = html.replace(
  '<main id="contenido-principal" class="main">\r\n      <div class="container main__grid">',
  '<main id="contenido-principal" class="main">\r\n      <div id="main-view">\r\n        <div class="container main__grid">'
);
html = html.replace(
  /<main id="contenido-principal" class="main">\s*<div class="container main__grid">/,
  '<main id="contenido-principal" class="main">\n      <div id="main-view">\n        <div class="container main__grid">'
);

// 4. Close #main-view and add #article-view before </main>
const endMainIndex = html.lastIndexOf('</main>');
if (endMainIndex !== -1) {
  const replacement = `      </div> <!-- end main-view -->

      <div id="article-view" class="container article-view" style="display: none; padding: 2rem 1rem;">
        <button id="back-btn" class="back-button">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Volver al Inicio
        </button>
        <article class="article-content">
          <span id="av-category" class="badge" style="margin-top: 1rem;"></span>
          <h1 id="av-headline" class="article-headline" style="margin-top: 0.5rem; font-size: 2.2rem;"></h1>
          <img id="av-image" src="" alt="Imagen de la noticia" class="article-image" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: var(--radius); margin: 1.5rem 0;">
          <div id="av-content" class="article-body" style="font-size: 1.1rem; line-height: 1.6; color: var(--text);"></div>
        </article>
      </div>
    </main>`;
  html = html.substring(0, endMainIndex) + replacement + html.substring(endMainIndex + 7);
}

// 5. Transform specific articles with data-id mapping
const mappings = [
  { term: 'Aldosivi gano contra Hurac', id: 'aldosivi' },
  { term: 'garantiza el funcionamiento de la Guardia del Mar', id: 'guardia' },
  { term: 'microbasurales y ratas en el barrio', id: 'basurales' },
  { term: 'paro universitario y proponen una nueva', id: 'paro-univ' },
  { term: 'fila para buscar trabajo en un nuevo local', id: 'fila-tecnologia' },
  { term: 'llevar a juicio a una banda', id: 'juicio-droga' },
  { term: 'Balean a un hombre en el pecho', id: 'balean-hombre' },
  { term: 'Comisi&oacute;n Libra', id: 'comision-libra' },
  { term: 'La Comisión Libra', id: 'comision-libra' },
  { term: 'inconstitucional la reforma laboral', id: 'reforma-laboral' },
  { term: 'Kicillof gana terreno', id: 'kicillof' },
  { term: 'Subieron 4% los combustibles', id: 'combustibles' },
  { term: 'Marcelo Araujo', id: 'araujo' },
  { term: 'AirPods Max 2', id: 'airpods-max' },
  { term: 'operaci&oacute;n terrestre en el L&iacute;bano', id: 'israel' },
  { term: 'operación terrestre en el Líbano', id: 'israel' },
  { term: 'monumento funerario romano', id: 'gladiadores' },
  { term: 'Uthgra', id: 'uthgra' },
  { term: 'Cabo Corrientes', id: 'nadador' },
  { term: 'abogada argentina', id: 'abogada-brasil' }
];

// Split the HTML into cards so we don't mess up non-card areas
// We look for '<article class="card..."' to the next '</article>'
let resultHtml = "";
let currentIndex = 0;
while (true) {
  let startIdx = html.indexOf('<article class="', currentIndex);
  if (startIdx === -1) {
    resultHtml += html.substring(currentIndex);
    break;
  }
  let endIdx = html.indexOf('</article>', startIdx);
  if (endIdx === -1) endIdx = html.length;
  else endIdx += 10;
  
  resultHtml += html.substring(currentIndex, startIdx);
  let cardHtml = html.substring(startIdx, endIdx);
  
  // Strip a tags pointing to lacapitalmdp.com and replace with #
  cardHtml = cardHtml.replace(/<a href="https[^"]+"(?: target="_blank" rel="noopener noreferrer")?>/g, '<a href="#">');
  
  // Find matching id
  let matchedId = null;
  for (let m of mappings) {
    if (cardHtml.includes(m.term)) {
      matchedId = m.id;
      break;
    }
  }
  
  if (matchedId) {
    cardHtml = cardHtml.replace(/<article class="([^"]+)"/, '<article class="$1" data-id="' + matchedId + '" style="cursor: pointer;"');
  }
  
  resultHtml += cardHtml;
  currentIndex = endIdx;
}

fs.writeFileSync(indexPath, resultHtml, 'utf8');
console.log("Rewrite complete.");
