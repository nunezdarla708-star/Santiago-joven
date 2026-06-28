# Apoyo Joven

Sitio web responsive para centralizar programas institucionales, voluntariado, actividades recreativas, preuniversitario, inscripciones con cupos, galería, soporte y administración de contenidos.

## Abrir el proyecto

1. Abre la carpeta del proyecto.
2. Ejecuta `index.html` con Live Server de Visual Studio Code o con un servidor local.
3. También puede abrirse directamente con doble clic, aunque Live Server ofrece una prueba más realista.

Servidor local opcional:

```bash
python -m http.server 5500
```

Luego abre `http://localhost:5500`.

## Acceso de demostración

- Administrador: `admin@munistgo.cl`
- Contraseña: `Santiago2026!`
- Editor: `editor@munistgo.cl`
- Contraseña: `Santiago2026!`

## Funcionalidades implementadas

- Diseño visual moderno, minimalista y responsive.
- Menú móvil y adaptación para celulares, tablets y computadores.
- Registro, inicio y recuperación de acceso en modo demostrativo.
- Roles: Administrador, Editor y Visitante.
- Actividades dinámicas con fecha, lugar, descripción, cupos e inscripción.
- Bloqueo automático cuando se agotan los cupos.
- Prevención de inscripciones duplicadas por correo y actividad.
- Secciones de Voluntariado Santo Tomás, actividades recreativas, preuniversitario, Lazos, SENDA y Educere.
- Noticias administrables.
- Galería filtrable, ampliación de imágenes y carga desde el panel.
- Formulario de soporte y preguntas frecuentes.
- Chat de orientación básica.
- Encuesta de satisfacción.
- Panel administrativo para actividades, noticias, galería, usuarios y soporte.
- Exportación de información a JSON.
- Persistencia local mediante LocalStorage.

## Limitación técnica de la entrega estática

La versión incluida funciona completamente en el navegador mediante LocalStorage. Esto permite publicarla en GitHub Pages o Netlify sin servidor. No debe utilizarse como sistema productivo con datos personales reales, porque LocalStorage no reemplaza una API, autenticación segura ni una base de datos centralizada.

La carpeta `database` contiene un modelo SQL recomendado para implementar una versión productiva con backend. Las contraseñas reales deben guardarse con hash seguro, por ejemplo Argon2 o bcrypt, nunca en texto plano.

## Publicar en Netlify

1. Ingresa a Netlify.
2. Selecciona **Add new site** y **Deploy manually**.
3. Arrastra la carpeta que contiene `index.html`.
4. Netlify entregará una URL pública.

También puedes conectar un repositorio de GitHub. Al ser un sitio estático, no requiere comando de compilación. El directorio de publicación es la raíz del proyecto.

## Publicar en GitHub Pages

1. Crea un repositorio y sube todos los archivos.
2. En GitHub abre **Settings > Pages**.
3. Selecciona **Deploy from a branch**.
4. Elige la rama `main` y la carpeta `/root`.
5. Guarda y espera la generación de la URL.

## Backend API (versión productiva)

La carpeta `database/apoyo_joven_backend/` contiene un servidor Node.js con Express y SQL Server que expone la API REST completa.

### Requisitos

- Node.js 18 o superior
- SQL Server (instancia local con autenticación de Windows)
- ODBC Driver 17 for SQL Server instalado

### Ejecutar el backend

```bash
cd database/apoyo_joven_backend
npm install
npm start
```

El servidor queda disponible en `http://localhost:3000`.

### Preparar la base de datos

1. Abre SQL Server Management Studio.
2. Ejecuta el archivo `database/schema.sql` completo.
3. Esto crea la base de datos, todas las tablas, roles, usuarios de demostración y datos iniciales.

### Rutas disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/activities` | Actividades publicadas con cupos |
| POST | `/api/activities` | Crear actividad (editor/admin) |
| DELETE | `/api/activities/:id` | Despublicar actividad |
| GET | `/api/activities/:id/registrations` | Inscritos de una actividad |
| POST | `/api/registrations` | Inscribirse en una actividad |
| GET | `/api/users` | Lista de usuarios (admin) |
| POST | `/api/users` | Registrar nuevo usuario |
| PATCH | `/api/users/:id/role` | Cambiar rol de usuario |
| GET | `/api/news` | Noticias publicadas |
| POST | `/api/news` | Publicar noticia |
| DELETE | `/api/news/:id` | Despublicar noticia |
| GET | `/api/gallery` | Imágenes de galería |
| POST | `/api/gallery` | Agregar imagen |
| DELETE | `/api/gallery/:id` | Eliminar imagen |
| GET | `/api/surveys` | Encuestas activas |
| POST | `/api/surveys/:id/responses` | Responder encuesta |
| GET | `/api/surveys/:id/results` | Resultados de encuesta |
| GET | `/api/support` | Mensajes de soporte (admin) |
| POST | `/api/support` | Enviar mensaje de soporte |
| PATCH | `/api/support/:id/status` | Actualizar estado de mensaje |

---

## Archivos de documentación

| Documento | Contenido |
|---|---|
| `docs/Guia_Actualizacion_Contenidos.md` | Cómo Santiago Joven actualiza contenidos sin tocar el código |
| `docs/Informe_Proyecto.md` | Informe completo con descripción de programas y arquitectura |
| `docs/Documentacion_Tecnica.md` | Módulos JavaScript, validaciones y recomendaciones productivas |
| `docs/Stack_Tecnologico.md` | Tecnologías utilizadas y justificación de cada elección |
| `docs/Roles_y_Responsabilidades.md` | Quién hizo qué, con entregables verificables por integrante |
| `docs/Registro_Reuniones.md` | Actas semanales, acuerdos y dificultades del proceso |
| `docs/Tablero_Tareas.md` | 49 tareas distribuidas en 5 sprints con estado de completitud |
| `docs/Pruebas_Funcionales.md` | 18 casos de prueba funcional y 6 pruebas responsive |
| `docs/Evidencias.md` | Guía de capturas y tabla de resultados de pruebas |
| `database/schema.sql` | Modelo relacional T-SQL con datos iniciales para SQL Server |
| `database/apoyo_joven_backend/index.js` | API REST con Node.js y SQL Server (20 rutas) |

## Créditos visuales

La galería utiliza fotografías remotas gratuitas de Unsplash y la imagen original `assets/banner.png`. Los créditos de autor se conservan en los datos iniciales de `script.js`.
