/**
 * nodos.js
 * Definición estática (Diccionario/Blueprints) de los 5 objetos <a> a instanciar.
 * Son moldes puros de datos. No ejecutan manipulación DOM per se.
 */

window.BLUEPRINTS_NODOS = [
    {
        id:          "enlace-google",
        texto:       "Google",
        href:        "https://www.google.com",
        target:      "_blank",
        title:       "Ir a Google",
        clase:       "nodo-buscador",
        descripcion: "Motor de búsqueda dominante",
        icono:       "🔍"
    },
    {
        id:          "enlace-wiki",
        texto:       "Wikipedia",
        href:        "https://www.wikipedia.org",
        target:      "_blank",
        title:       "Ir a Wikipedia",
        clase:       "nodo-enciclopedia",
        descripcion: "Enciclopedia libre global",
        icono:       "📚"
    },
    {
        id:          "enlace-github",
        texto:       "GitHub",
        href:        "https://www.github.com",
        target:      "_blank",
        title:       "Ver repositorios",
        clase:       "nodo-codigo",
        descripcion: "Plataforma de repositorios",
        icono:       "💻"
    },
    {
        id:          "enlace-youtube",
        texto:       "YouTube",
        href:        "https://www.youtube.com",
        target:      "_blank",
        title:       "Ver videos",
        clase:       "nodo-video",
        descripcion: "Plataforma audiovisual",
        icono:       "🎬"
    },
    {
        id:          "enlace-noticias",
        texto:       "BBC Noticias",
        href:        "https://www.bbc.com/mundo",
        target:      "_self",
        title:       "Leer noticias",
        clase:       "nodo-noticia",
        descripcion: "Portal de actualidad internacional",
        icono:       "📰"
    }
];
