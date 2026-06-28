# Roles y responsabilidades del equipo

Somos tres integrantes y desde el principio dividimos el trabajo en tres áreas claras para que cada uno tuviera responsabilidad sobre una parte específica del proyecto.

---

## Integrante 1 — Diseño y frontend

Se encargó de todo lo visual: la estructura HTML y los estilos CSS.

Lo que hizo concretamente:
- Armó todas las secciones del sitio: el hero de entrada, los programas Lazos, SENDA y Educere, las actividades, el voluntariado, el preuniversitario, la galería, el soporte y el footer
- Diseñó el sistema de estilos con variables CSS para los colores y tamaños, lo que hace que sea fácil cambiar el diseño desde un solo lugar
- Hizo que el sitio funcione bien en celular, tablet y computador usando media queries en tres puntos de quiebre distintos
- En celular el menú se transforma en un botón de tres rayas, las tarjetas se apilan en una columna y los formularios se reorganizan solos

**Archivos que produjo:** `index.html`, `styles.css`

---

## Integrante 2 — Programación y funcionalidades

Se encargó de toda la lógica del sitio en JavaScript.

Lo que hizo concretamente:
- Sistema completo de registro de usuarios con validaciones: el correo no puede repetirse, la contraseña necesita al menos 8 caracteres con letras y números
- Sistema de inicio de sesión con hash de contraseña y recuperación de acceso
- Inscripciones a actividades con control de cupos: cuando se llena el límite, el botón se bloquea automáticamente
- Prevención de inscripciones duplicadas: el mismo correo no puede inscribirse dos veces en la misma actividad
- Panel administrativo para gestionar actividades, noticias, galería, usuarios y soporte
- FAQ con acordeón, chat de ayuda automática, encuesta de satisfacción y exportación de datos a JSON
- Integración con el backend: los formularios de inscripción, soporte y encuesta envían los datos al servidor usando `fetch`

**Archivos que produjo:** `script.js`

---

## Integrante 3 — Base de datos, backend y despliegue

Se encargó de la parte técnica del servidor y de dejar todo documentado y publicado.

Lo que hizo concretamente:
- Diseñó el modelo relacional de la base de datos con 10 tablas en SQL Server: usuarios, actividades, inscripciones, noticias, galería, encuestas, respuestas de encuesta, mensajes de soporte, roles y recuperación de acceso
- Configuró los tres roles del sistema: Administrador, Editor y Visitante
- Programó el backend en Node.js con Express: 20 rutas que reciben los datos del sitio y los guardan en SQL Server
- Las inscripciones usan transacciones SQL con bloqueo de fila para evitar sobreventa de cupos
- Publicó el sitio en Netlify
- Subió el código a GitHub
- Escribió la documentación: informe del proyecto, pruebas funcionales, guía de actualización de contenidos para Santiago Joven, stack tecnológico, registro de reuniones y tablero de tareas

**Archivos que produjo:** `database/schema.sql`, `database/apoyo_joven_backend/index.js`, todos los documentos en `docs/`, `README.md`, `netlify.toml`
