// Datos iniciales de ejemplo para poblar la lista de tareas al arrancar la app

export const tareasIniciales = [
  {
    id: "1a2b3c4d-0001-0000-0000-000000000001",
    titulo: "Diseñar wireframes de la aplicación",
    descripcion:
      "Crear los bocetos de baja fidelidad para todas las pantallas principales de la app: inicio, detalle, formulario de creación y estados vacíos. Usar Figma o papel según disponibilidad.",
    fechaCreacion: "2026-08-01T10:00:00.000Z",
    completa: true,
  },
  {
    id: "1a2b3c4d-0002-0000-0000-000000000002",
    titulo: "Configurar entorno de desarrollo",
    descripcion:
      "Instalar Node.js, crear el proyecto con Vite, agregar React Router DOM y Bootstrap 5. Verificar que el servidor de desarrollo corra sin errores antes de continuar.",
    fechaCreacion: "2026-08-02T09:30:00.000Z",
    completa: true,
  },
  {
    id: "1a2b3c4d-0003-0000-0000-000000000003",
    titulo: "Implementar componente Navbar",
    descripcion:
      "Construir la barra de navegación con Bootstrap 5: logo, enlaces de ruta y menú hamburguesa responsive que se colapsa automáticamente al seleccionar un enlace en móvil.",
    fechaCreacion: "2026-08-03T11:15:00.000Z",
    completa: false,
  },
  {
    id: "1a2b3c4d-0004-0000-0000-000000000004",
    titulo: "Crear página de inicio con lista de tareas",
    descripcion:
      "Desarrollar la vista Home con grid de cards responsivo. Cada card muestra título, descripción truncada y badge de estado. Incluir estado vacío con mensaje en español.",
    fechaCreacion: "2026-08-04T14:00:00.000Z",
    completa: false,
  },
  {
    id: "1a2b3c4d-0005-0000-0000-000000000005",
    titulo: "Formulario de creación con validación en tiempo real",
    descripcion:
      "Construir el formulario de CreateTask con campos controlados, validación reactiva (sin atributos HTML5 nativos), mensajes de error en español y redirección automática al crear la tarea.",
    fechaCreacion: "2026-08-05T16:45:00.000Z",
    completa: false,
  },
  {
    id: "1a2b3c4d-0006-0000-0000-000000000006",
    titulo: "Escribir tests unitarios con Vitest",
    descripcion:
      "Cubrir con tests los componentes principales y las funciones utilitarias (formatDate, generateId). Meta mínima: 80% de cobertura en src/components y src/pages.",
    fechaCreacion: "2026-08-06T08:00:00.000Z",
    completa: false,
  },
];
