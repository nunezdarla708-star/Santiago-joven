# Registro de Reuniones y Seguimiento — Apoyo Joven

## Metodología de trabajo

El equipo adoptó una metodología de trabajo iterativa e incremental inspirada en Scrum, organizada en sprints semanales. Cada semana se definieron tareas específicas por integrante, se revisó el avance de la semana anterior y se acordaron los compromisos para la siguiente.

Las reuniones se realizaron de forma presencial y por videollamada, con un mínimo de una reunión semanal de sincronización y sesiones de trabajo colaborativo según necesidad.

---

## Semana 1 — Planificación y diseño inicial

**Fecha:** Primera semana del proyecto
**Modalidad:** Presencial
**Participantes:** Los tres integrantes

**Temas tratados:**
- Revisión de los requerimientos del socio comunitario Santiago Joven
- Definición de la estructura del sitio (secciones, navegación, contenidos)
- Distribución de roles y responsabilidades por integrante
- Selección del stack tecnológico: HTML, CSS, JavaScript, SQL Server, Node.js, Netlify
- Definición de la paleta de colores y estilo visual

**Acuerdos:**
- Integrante 1 comienza con maquetación HTML y estilos base
- Integrante 2 define estructura JavaScript y sistema de datos
- Integrante 3 diseña el modelo de base de datos
- Próxima reunión: revisar avance del esqueleto del sitio

**Dificultades:** Ninguna en esta etapa.

---

## Semana 2 — Desarrollo del esqueleto y estructura base

**Fecha:** Segunda semana del proyecto
**Modalidad:** Videollamada
**Participantes:** Los tres integrantes

**Temas tratados:**
- Revisión del avance de maquetación HTML (Integrante 1)
- Revisión del sistema de LocalStorage y seed data (Integrante 2)
- Revisión del borrador del schema SQL (Integrante 3)
- Decisión de usar LocalStorage para la versión de demostración y SQL Server para la versión productiva

**Acuerdos:**
- Integrante 1: completar secciones Programas, Actividades y Voluntariado
- Integrante 2: implementar sistema de usuarios y autenticación
- Integrante 3: completar modelo relacional y agregar tablas de encuestas y soporte
- Se acordó usar Netlify para el despliegue estático

**Dificultades:** Compatibilidad de tipos de datos entre MySQL y SQL Server. Se decidió migrar a T-SQL puro.

---

## Semana 3 — Desarrollo de funcionalidades principales

**Fecha:** Tercera semana del proyecto
**Modalidad:** Presencial
**Participantes:** Los tres integrantes

**Temas tratados:**
- Revisión del sistema de inscripción con control de cupos (Integrante 2)
- Revisión del diseño responsive en distintos dispositivos (Integrante 1)
- Avance del backend Node.js con Express (Integrante 3)
- Prueba de conexión entre el frontend y el backend

**Acuerdos:**
- Integrante 1: corregir visualización en resoluciones tablet y celular pequeño
- Integrante 2: implementar panel administrativo y sistema de roles
- Integrante 3: completar rutas de la API REST para inscripciones, noticias y galería
- Documentar pruebas funcionales

**Dificultades:** El backend usaba IDs de texto del frontend ("act-excel") incompatibles con BIGINT de SQL Server. Se resolvió con un mapa de nombres en la ruta de inscripciones.

---

## Semana 4 — Integración, pruebas y correcciones

**Fecha:** Cuarta semana del proyecto
**Modalidad:** Presencial y videollamada
**Participantes:** Los tres integrantes

**Temas tratados:**
- Integración del frontend con el backend: el `script.js` ahora envía datos a SQL Server mediante `fetch`
- Verificación de inscripciones en SSMS
- Corrección del schema SQL de MySQL a T-SQL (IDENTITY, BIT, CHECK en lugar de ENUM)
- Prueba del sitio en dispositivos móviles
- Configuración de CORS para permitir peticiones desde `127.0.0.1:5500`

**Acuerdos:**
- Integrante 1: verificar diseño final y correcciones de accesibilidad
- Integrante 2: corregir advertencia de aria-hidden en modales
- Integrante 3: publicar en Netlify y actualizar documentación con URL real
- Preparar presentación final

**Dificultades:** El firewall de Windows bloqueaba el acceso desde dispositivos móviles en red local. Se resolvió publicando en Netlify para acceso desde cualquier dispositivo.

---

## Semana 5 — Cierre, despliegue y entrega final

**Fecha:** Semana de entrega
**Modalidad:** Presencial
**Participantes:** Los tres integrantes

**Temas tratados:**
- Revisión final de todos los módulos del sitio
- Verificación del sitio en Netlify desde distintos dispositivos
- Revisión de la documentación completa
- Preparación de la presentación ante el docente y Santiago Joven
- Distribución de partes de la exposición por integrante

**Acuerdos:**
- Cada integrante expone su área de trabajo
- Se prepara demo en vivo con el sitio publicado
- Entrega del repositorio y carpeta de evidencias

**Resultado:** Proyecto entregado con todas las funcionalidades operativas, documentación completa y sitio desplegado en Netlify.

---

## Resumen de seguimiento semanal

| Semana | Actividad principal | Estado |
|---|---|---|
| 1 | Planificación, roles, stack tecnológico | ✅ Completado |
| 2 | Esqueleto HTML/CSS, estructura JS, modelo SQL | ✅ Completado |
| 3 | Funcionalidades, responsive, backend API | ✅ Completado |
| 4 | Integración frontend-backend, pruebas, correcciones | ✅ Completado |
| 5 | Despliegue, documentación final, presentación | ✅ Completado |
