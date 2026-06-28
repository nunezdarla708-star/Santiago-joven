# Registro de reuniones del equipo

Durante el desarrollo del proyecto nos juntamos semanalmente para revisar el avance, repartir tareas y resolver los problemas que iban apareciendo. Acá están las notas de cada reunión.

---

## Semana 1 — Arranque del proyecto

**Modalidad:** Presencial
**Participantes:** Los tres integrantes

En esta primera reunión revisamos los requerimientos de Santiago Joven y lo que pedía la evaluación. Decidimos qué secciones iba a tener el sitio y cómo nos íbamos a repartir el trabajo.

También elegimos las tecnologías: HTML, CSS y JavaScript para el frontend, Node.js con Express para el backend, y SQL Server para la base de datos. Elegimos eso porque era lo que más habíamos visto en clases y nos sentíamos más cómodos.

**Responsabilidades que quedaron definidas:**
- Integrante 1: estructura HTML y estilos CSS
- Integrante 2: lógica JavaScript y funcionalidades
- Integrante 3: base de datos y backend

**Para la próxima reunión:** tener el esqueleto del sitio funcionando y el borrador de las tablas de la base de datos.

---

## Semana 2 — Revisión del esqueleto

**Modalidad:** Videollamada
**Participantes:** Los tres integrantes

Revisamos lo que llevaba cada uno. El integrante 1 ya tenía el header, el nav y las primeras secciones armadas. El integrante 2 había definido la estructura de datos en LocalStorage. El integrante 3 tenía el borrador del modelo relacional.

Una decisión importante que tomamos en esta reunión fue usar LocalStorage para la versión de demostración en Netlify, y SQL Server para la versión con backend real. Así el sitio puede publicarse sin servidor y también conectarse a la base de datos cuando está disponible.

**Dificultades:** ninguna mayor por ahora.

**Para la próxima:** completar las secciones principales y arrancar con el sistema de login.

---

## Semana 3 — Funcionalidades principales

**Modalidad:** Presencial
**Participantes:** Los tres integrantes

Esta fue la semana más intensa. El integrante 2 terminó el sistema de login, registro y las inscripciones con control de cupos. El integrante 1 trabajó en el responsive para que se viera bien en celular. El integrante 3 avanzó con las rutas del backend.

Cuando intentamos conectar el frontend con el backend nos dimos cuenta de un problema: los IDs de las actividades en el sitio eran textos como "act-excel", pero en SQL Server son números. Tuvimos que crear un mapa en el backend que tradujera esos IDs al nombre de la actividad para buscarla en la base de datos.

**Dificultades:** incompatibilidad de IDs entre el frontend y SQL Server. Se resolvió con un mapa de nombres en la ruta de inscripciones.

**Para la próxima:** probar la conexión completa y arreglar lo que no funcione.

---

## Semana 4 — Integración y pruebas

**Modalidad:** Presencial + videollamada
**Participantes:** Los tres integrantes

Esta semana fue de arreglar cosas. El schema SQL que teníamos estaba escrito para MySQL y SQL Server no lo aceptaba. Tuvimos que reescribir todo el script usando T-SQL: cambiar `AUTO_INCREMENT` por `IDENTITY`, `BOOLEAN` por `BIT`, los `ENUM` por `CHECK`, y los `TIMESTAMP ON UPDATE` por triggers.

También tuvimos problemas con el CORS: el navegador bloqueaba las peticiones porque el sitio abría desde `127.0.0.1` y no desde `localhost`. Se resolvió agregando la IP al listado de orígenes permitidos en el backend.

Al final de la semana las inscripciones llegaban a SQL Server y se podía verificar con un `SELECT * FROM inscripciones` en SSMS.

**Dificultades:** schema SQL incompatible con SQL Server, configuración de CORS.

**Para la próxima:** publicar en Netlify y preparar la documentación.

---

## Semana 5 — Cierre y entrega

**Modalidad:** Presencial
**Participantes:** Los tres integrantes

Revisamos todo el sitio de arriba a abajo. Probamos cada funcionalidad: login, registro, inscripciones, galería, soporte, panel de administrador. Anotamos los resultados en la tabla de pruebas funcionales.

El integrante 3 subió el sitio a Netlify arrastrando la carpeta, y quedó publicado en pocos minutos. También inicializamos el repositorio en GitHub y subimos todos los archivos.

El integrante 1 hizo las pruebas responsive en las DevTools del navegador con distintas resoluciones. Todo funcionaba bien.

Nos repartimos las partes de la presentación y acordamos que cada uno explica su área de trabajo.

**Resultado:** proyecto entregado con todas las funcionalidades funcionando, documentación completa y sitio publicado.
