# Informe del proyecto — Apoyo Joven / Santiago Joven

## 1. Introducción

Este proyecto nació a partir de la necesidad de Santiago Joven de tener una plataforma web donde pudieran publicar sus actividades, talleres y programas de forma ordenada y accesible para los jóvenes. Antes de esto, no tenían una forma centralizada de mostrar lo que ofrecen ni de recibir inscripciones de manera organizada.

Nosotras, como equipo de tres integrantes del curso Desarrollo Web I, decidimos construir una solución real que les sirva: un sitio web donde cualquier persona pueda ver los programas disponibles, inscribirse en actividades y contactar al equipo. Y desde el lado administrativo, que el personal de Santiago Joven pueda actualizar todo eso sin necesidad de saber programar.

---

## 2. Qué queríamos lograr

El objetivo principal era simple: que el sitio funcionara de verdad. No solo que se viera bonito, sino que tuviera lógica real detrás.

Lo que nos propusimos hacer desde el principio:

- Que el sitio se viera bien en celular, tablet y computador
- Que los usuarios pudieran registrarse e iniciar sesión
- Que las inscripciones a actividades tuvieran un límite de cupos real
- Que el administrador pudiera gestionar todo desde un panel, sin tocar el código
- Que los datos se guardaran en una base de datos de verdad (SQL Server)
- Publicar el sitio en internet para que cualquiera pudiera acceder

---

## 3. Programas de Santiago Joven

Para entender bien qué contenidos debía tener el sitio, investigamos los tres programas principales que ofrece Santiago Joven:

### Programa Lazos

Es un programa de apoyo para jóvenes y familias que están pasando por situaciones difíciles. El objetivo es detectar el problema a tiempo y orientarlos hacia la red de apoyo adecuada, ya sea profesional, familiar o comunitaria. Ofrece talleres de habilidades sociales y acompañamiento personalizado.

### Programa SENDA

Este programa trabaja la prevención del consumo de alcohol y drogas. Lo hacen principalmente en colegios y organizaciones juveniles, con talleres educativos, espacios de conversación y entrega de información confiable. El foco está en el autocuidado y la participación activa de los jóvenes.

### Programa Educere

Apoya a estudiantes que necesitan reforzamiento académico o que están buscando orientación vocacional. Tiene talleres de metodología de estudio, apoyo en asignaturas como matemática y lenguaje, y acompañamiento para decidir qué hacer después del colegio.

---

## 4. Lo que construimos

### Diseño y visual

Josselyn se encargó de todo lo visual. Construyó la estructura HTML del sitio con semántica correcta (usando etiquetas como `header`, `section`, `article`, `footer`), diseñó los estilos en CSS usando variables para los colores, y se aseguró de que el sitio se adaptara a distintos tamaños de pantalla.

El resultado fue un sitio limpio, moderno y que funciona bien desde un celular de 360px hasta un monitor de 1920px. El menú en celular se convierte en un botón hamburguesa, las tarjetas de actividades se apilan, los formularios se reorganizan solos.

### Funcionalidades

Katline programó toda la lógica del sitio en JavaScript. Lo más destacado:

- Sistema de registro e inicio de sesión con validaciones reales (el correo no puede duplicarse, la contraseña necesita letras y números, mínimo 8 caracteres)
- Inscripciones a actividades con control de cupos: cuando se llena el límite, el botón se bloquea y aparece "Cupos agotados"
- Panel administrativo donde el administrador puede crear actividades, publicar noticias, subir fotos a la galería y revisar las consultas de soporte
- Sistema de roles: Administrador, Editor y Visitante, cada uno ve cosas distintas según su nivel de acceso
- FAQ con acordeón, chat de orientación automática y encuesta de satisfacción

### Base de datos y backend

Darla diseñó el modelo de base de datos en SQL Server y programó el backend con Node.js. Se crearon 10 tablas relacionadas: usuarios, actividades, inscripciones, noticias, galería, encuestas, respuestas, mensajes de soporte y recuperación de acceso.

El backend expone una API REST con 20 rutas. Cuando alguien se inscribe en el sitio, el dato viaja al servidor y se guarda en SQL Server usando una transacción para evitar que dos personas tomen el último cupo al mismo tiempo.

También se publicó el sitio en Netlify y se subió todo al repositorio de GitHub.

---

## 5. Cómo Santiago Joven puede actualizar el sitio

Una de las cosas que más nos importaba era que el personal de Santiago Joven pudiera mantener el sitio actualizado sin necesidad de llamarnos. Para eso existe el Panel Administrativo.

Desde ahí, con solo ingresar con su usuario y contraseña, pueden:
- Crear o editar actividades (nombre, fecha, cupos, descripción)
- Publicar noticias
- Subir fotos a la galería
- Ver las consultas que les mandan los usuarios
- Gestionar los roles de los usuarios registrados

Todo desde el navegador, sin tocar ningún archivo de código.

---

## 6. Cómo funcionan los cupos

Cada actividad tiene un número máximo de inscritos. El sistema calcula cuántos quedan disponibles en tiempo real. Cuando llega a cero, el botón de inscripción se deshabilita y aparece el mensaje de cupos agotados.

En el backend, esto se maneja con una transacción SQL que bloquea la fila de la actividad antes de insertar la inscripción, para que no haya problemas si dos personas intentan tomar el último cupo al mismo tiempo.

---

## 7. Tecnologías que usamos

- HTML, CSS y JavaScript para el frontend
- Node.js con Express para el backend
- SQL Server con T-SQL para la base de datos
- LocalStorage como respaldo cuando el servidor no está disponible
- Netlify para el despliegue del sitio estático
- GitHub para el repositorio del proyecto

Elegimos este stack porque es el que aprendimos durante el semestre y porque nos permitía construir algo real y funcional sin depender de frameworks complejos que no dominamos bien todavía.

---

## 8. Dónde está todo

- Sitio publicado: https://inspiring-truffle-0a3982.netlify.app
- Repositorio: https://github.com/nunezdarla708-star/Santiago-joven

---

## 9. Conclusión

Estamos conformes con lo que logramos. El sitio tiene todo lo que pedía la evaluación y más: funciona en distintos dispositivos, tiene base de datos real, el administrador puede gestionar contenidos sin tocar el código, y quedó publicado en internet.

Hubo dificultades en el camino, como el problema de compatibilidad entre la sintaxis de MySQL y SQL Server, o la configuración del CORS para que el celular pudiera conectarse al backend. Pero las fuimos resolviendo entre los tres.

Lo más valioso fue aprender a conectar todas las partes: el frontend, el backend y la base de datos trabajando juntos en un proyecto real.
