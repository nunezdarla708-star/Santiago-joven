# Informe del proyecto — Apoyo Joven

## 1. Introducción

Apoyo Joven es una plataforma web orientada a reunir información, programas e instancias de participación para jóvenes. El proyecto busca facilitar el acceso a actividades, voluntariado, talleres, preuniversitario y programas institucionales mediante una interfaz simple, clara y adaptable a distintos dispositivos.

El sitio fue desarrollado como proyecto académico integrando tres áreas de trabajo: diseño frontend, programación con JavaScript, y base de datos con documentación.

---

## 2. Objetivo general

Desarrollar un sitio web funcional y responsive que permita informar, registrar usuarios, gestionar actividades con cupos limitados, publicar contenidos, administrar una galería y entregar soporte básico a jóvenes participantes.

---

## 3. Objetivos específicos

- Mejorar la experiencia visual mediante un diseño moderno y minimalista.
- Facilitar la navegación en celulares, tablets y computadores.
- Incorporar registro, inicio y recuperación de acceso con validaciones.
- Implementar inscripciones con control automático de cupos (máximo 40 por actividad).
- Centralizar los programas Lazos, SENDA y Educere con sus contenidos.
- Publicar secciones de Voluntariado Santo Tomás, Actividades Recreativas y Preuniversitario.
- Permitir gestión completa de actividades, noticias, galería, usuarios y soporte desde panel administrativo.
- Preparar el proyecto para publicación en hosting estático (Netlify / GitHub Pages).
- Documentar pruebas, arquitectura, modelo de datos y evidencias.

---

## 4. Descripción de los programas institucionales

### Programa Lazos

Programa de prevención e intervención temprana orientado a jóvenes y sus familias. Su objetivo es detectar situaciones de vulnerabilidad de forma oportuna y ofrecer orientación, acompañamiento y derivación a redes de apoyo comunitario e institucional.

**Servicios:**
- Orientación familiar y personal.
- Detección temprana de situaciones de riesgo.
- Derivación a redes de apoyo especializadas.
- Talleres de habilidades sociales y comunicación.

### Programa SENDA

Programa de prevención del consumo de alcohol, drogas y otras sustancias, dependiente del Servicio Nacional para la Prevención y Rehabilitación del Consumo de Drogas y Alcohol. Trabaja con jóvenes, colegios y organizaciones comunitarias.

**Servicios:**
- Talleres preventivos en establecimientos educacionales.
- Información confiable sobre consecuencias del consumo.
- Espacios de orientación, escucha y apoyo.
- Participación comunitaria y autocuidado.

### Programa Educere

Programa de acompañamiento académico y desarrollo personal para jóvenes en etapa escolar. Apoya el rendimiento académico, la orientación vocacional y el crecimiento formativo de manera integral.

**Servicios:**
- Apoyo académico en asignaturas clave.
- Orientación vocacional y educativa.
- Desarrollo de habilidades personales.
- Talleres de metodología de estudio.

---

## 5. Alcance implementado

La entrega incluye una aplicación web estática construida con HTML, CSS y JavaScript. Todos los módulos funcionan dentro del navegador y utilizan LocalStorage para conservar los cambios durante la demostración. La carpeta `database` contiene el modelo SQL y el backend Node.js para una versión productiva.

### Diseño y experiencia de usuario (Integrante 1)

- Interfaz minimalista con jerarquía visual clara y paleta de colores institucional.
- Tipografía de sistema para reducir dependencias y mejorar la carga.
- Menú hamburguesa adaptable y navegación por anclas.
- Diseño responsive con breakpoints en 1040 px, 800 px y 560 px.
- Galería filtrable por categoría con visualización ampliada (lightbox).
- Sección Voluntariado Santo Tomás con imagen, información y cuadrícula de detalles.
- Sección Actividades Recreativas con tarjetas dinámicas y filtros.
- Sección Preuniversitario con módulos por asignatura.
- Estados visuales de foco, error, éxito y bloqueo en todos los componentes interactivos.

### Programación y funcionalidades (Integrante 2)

- Registro de usuarios con validación de correo único y contraseña segura (mínimo 8 caracteres con letras y números).
- Inicio de sesión con hash de contraseña y persistencia de sesión.
- Recuperación de acceso en modo demostrativo.
- Tres roles de acceso: Administrador, Editor y Visitante.
- Inscripción a actividades con formulario, validaciones y confirmación.
- Límite de 40 cupos por actividad con bloqueo automático al completarse.
- Mensaje de "Cupos agotados" y botón deshabilitado.
- Prevención de inscripciones duplicadas por correo y actividad.
- Carga de imágenes para galería (URL externa o archivo local hasta 1,5 MB).
- Sistema de contacto/soporte con registro de consultas.
- Sección de preguntas frecuentes (FAQ) con acordeón.
- Chat de orientación básica automático.
- Encuesta de satisfacción con calificación 1–5.
- Panel administrativo completo con gestión de actividades, noticias, galería, usuarios y soporte.
- Exportación de datos a JSON.

### Base de datos y documentación (Integrante 3)

- Modelo relacional completo en `database/schema.sql` para MySQL 8.x.
- Tablas: `roles`, `usuarios`, `actividades`, `inscripciones`, `noticias`, `galeria`, `encuestas`, `respuestas_encuesta`, `mensajes_soporte`, `recuperacion_acceso`.
- Roles configurados: Administrador, Editor, Visitante.
- Datos iniciales: usuarios, actividades, noticias, galería y encuesta de demostración.
- Backend Node.js en `database/apoyo_joven_backend/index.js` con API REST completa.
- Endpoints para todos los módulos: actividades, inscripciones, usuarios, noticias, galería, encuestas y soporte.
- Transacciones SQL para control de cupos sin condición de carrera.
- Hosting configurado con `netlify.toml`.
- Repositorio organizado con estructura clara.
- Documentación técnica, informe, pruebas funcionales y guía de evidencias.

---

## 6. Roles del sistema

| Rol | Descripción | Permisos |
|---|---|---|
| Administrador | Gestión total del sistema | Crear/editar actividades, noticias, galería; cambiar roles; ver soporte y encuestas; exportar; restablecer demostración |
| Editor | Gestión de contenidos | Crear/editar actividades, noticias, galería; revisar soporte. Sin acceso a roles ni restablecimiento |
| Visitante | Usuario registrado | Navegar, inscribirse, enviar soporte, responder encuestas |

---

## 7. Sistema de cupos

Cada actividad tiene un límite máximo definido en la base de datos. El sistema calcula:

```
cupos disponibles = capacidad total − inscritos base − nuevas inscripciones
```

Cuando el resultado llega a cero:
- El botón muestra "Inscripción cerrada" y queda deshabilitado.
- La barra de progreso se colorea en rojo.
- El estado muestra "Cupos agotados".
- No es posible inscribirse, incluso si el usuario intenta acceder directamente.

En el backend con SQL Server se usa `UPDLOCK + HOLDLOCK` dentro de una transacción para evitar sobreventa en accesos concurrentes.

---

## 8. Arquitectura técnica

### Versión de evaluación (estática)

```
Navegador → index.html + styles.css + script.js → LocalStorage
```

No requiere servidor. Publicable en Netlify o GitHub Pages.

### Versión productiva (recomendada)

```
Navegador
   │ HTTPS
API REST (Node.js / Express)  ← database/apoyo_joven_backend/index.js
   ├── Autenticación y autorización (JWT / sesiones)
   ├── Gestión de actividades y cupos con transacciones SQL
   ├── Envío de correos (recuperación de acceso)
   └── Carga segura de imágenes (almacenamiento de objetos)
        │
SQL Server / MySQL  ← database/schema.sql
```

---

## 9. Despliegue

### Netlify (versión estática)

1. Ingresar a [netlify.com](https://netlify.com).
2. Seleccionar **Add new site → Deploy manually**.
3. Arrastrar la carpeta que contiene `index.html`.
4. URL publicada: **https://inspiring-truffle-0a3982.netlify.app**

### GitHub Pages

1. Subir todos los archivos a un repositorio en GitHub.
2. En **Settings → Pages**, seleccionar rama `main` y carpeta `/root`.
3. Guardar y esperar la generación de la URL.

---

## 10. Conclusión

La versión final cumple con todos los módulos solicitados para la evaluación académica. El sitio ofrece una experiencia visual consistente en escritorio, tablet y celular, y demuestra la lógica completa de usuarios, contenidos, cupos, galería, soporte y administración.

El modelo relacional (`schema.sql`) y el backend Node.js dejan una ruta clara y documentada para evolucionar desde la demostración local con LocalStorage hacia una arquitectura productiva con base de datos real, autenticación segura y almacenamiento de archivos en servidor.
