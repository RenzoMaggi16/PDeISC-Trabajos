// Módulo de datos: array en memoria de alumnos + funciones de consulta (sin HTTP)

const alumnos = [
  { id: 1,  nombre: 'Valentina Torres',   edad: 22, carrera: 'Ingeniería en Sistemas', promedio: 8.7,  activo: true  },
  { id: 2,  nombre: 'Matías Fernández',   edad: 20, carrera: 'Diseño Gráfico',         promedio: 7.3,  activo: true  },
  { id: 3,  nombre: 'Luciana Herrera',    edad: 25, carrera: 'Contabilidad',            promedio: 9.1,  activo: true  },
  { id: 4,  nombre: 'Joaquín Romero',     edad: 23, carrera: 'Medicina',               promedio: 6.8,  activo: false },
  { id: 5,  nombre: 'Camila Suárez',      edad: 21, carrera: 'Derecho',                promedio: 8.2,  activo: true  },
  { id: 6,  nombre: 'Nicolás Acosta',     edad: 28, carrera: 'Arquitectura',           promedio: 7.9,  activo: true  },
  { id: 7,  nombre: 'Florencia Méndez',   edad: 19, carrera: 'Ingeniería en Sistemas', promedio: 9.4,  activo: true  },
  { id: 8,  nombre: 'Tomás Villalba',     edad: 24, carrera: 'Diseño Gráfico',         promedio: 6.5,  activo: false },
  { id: 9,  nombre: 'Agustina Paredes',   edad: 26, carrera: 'Contabilidad',            promedio: 8.0,  activo: true  },
  { id: 10, nombre: 'Santiago Gutiérrez', edad: 18, carrera: 'Medicina',               promedio: 7.6,  activo: true  },
];

// Devuelve todos los alumnos, opcionalmente filtrados por carrera (coincidencia parcial, sin distinción de mayúsculas)
function obtenerTodos(filtroCarrera) {
  if (!filtroCarrera || filtroCarrera.trim() === '') {
    return alumnos;
  }
  const termino = filtroCarrera.trim().toLowerCase();
  return alumnos.filter((a) => a.carrera.toLowerCase().includes(termino));
}

// Devuelve un alumno por su ID numérico o null si no existe
function obtenerPorId(id) {
  return alumnos.find((a) => a.id === id) || null;
}

module.exports = { obtenerTodos, obtenerPorId };
