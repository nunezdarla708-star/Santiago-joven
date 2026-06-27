# Roles y Responsabilidades del Equipo — Apoyo Joven

## Distribución del equipo

El proyecto fue desarrollado por tres integrantes con roles definidos desde el inicio, cada uno responsable de un área específica del sistema.

---

## Integrante 1 — Diseño Frontend y Experiencia de Usuario

**Responsabilidades:**
- Diseño visual general del sitio web
- Maquetación HTML de todas las secciones
- Diseño y desarrollo de la galería de imágenes con filtros y lightbox
- Sección Voluntariado Santo Tomás
- Sección Actividades Recreativas
- Sección Preuniversitario
- Adaptación responsive para celulares, tablets y computadores
- Optimización de colores, tipografías y espaciados
- Corrección de estilos CSS
- Organización visual de formularios y botones

**Entregables verificables:**
- Archivo `styles.css` — sistema de variables CSS, grid, flexbox, media queries
- Archivo `index.html` — estructura semántica completa con todas las secciones
- Diseño responsivo probado en resoluciones 360px, 390px, 768px, 1024px, 1366px y 1920px
- Galería con 4 categorías, filtros y visualización ampliada

---

## Integrante 2 — Programación y Funcionalidades

**Responsabilidades:**
- Desarrollo JavaScript completo del sitio
- Sistema de inicio de sesión con hash de contraseña
- Sistema de registro de usuarios con validaciones
- Recuperación de acceso
- Formulario de inscripción a actividades con límite de 40 cupos
- Mensaje de cupos agotados y bloqueo de botón
- Carga de imágenes para la galería (URL o archivo local)
- Sistema de contacto y soporte
- Sección de preguntas frecuentes (FAQ) con acordeón
- Chat de orientación básica
- Corrección de errores de JavaScript
- Pruebas funcionales de todos los módulos

**Entregables verificables:**
- Archivo `script.js` — sistema completo encapsulado, sin variables globales
- Sistema de autenticación con 3 roles: Administrador, Editor, Visitante
- Panel administrativo con 5 secciones: Actividades, Noticias, Galería, Usuarios, Soporte
- 18 pruebas funcionales documentadas en `docs/Pruebas_Funcionales.md`
- Integración con API REST para envío de datos a SQL Server

---

## Integrante 3 — Base de Datos, Hosting y Documentación

**Responsabilidades:**
- Diseño del modelo relacional de la base de datos
- Creación de tablas: Usuarios, Actividades, Inscripciones, Noticias, Galería, Encuestas, Soporte
- Configuración de roles: Administrador, Editor, Visitante
- Datos iniciales de los programas: Lazos, SENDA, Educere, Preuniversitario
- Desarrollo del backend Node.js con API REST (20 rutas)
- Configuración de hosting y despliegue en Netlify
- Mantenimiento del repositorio GitHub
- Elaboración del informe de avance
- Documentación técnica completa
- Preparación de la entrega final

**Entregables verificables:**
- Archivo `database/schema.sql` — modelo T-SQL completo para SQL Server con datos iniciales
- Archivo `database/apoyo_joven_backend/index.js` — API REST con Express y SQL Server
- Sitio publicado en Netlify: https://inspiring-truffle-0a3982.netlify.app
- Documentos: `Informe_Proyecto.md`, `Documentacion_Tecnica.md`, `Pruebas_Funcionales.md`, `Evidencias.md`
- `README.md` con instrucciones completas de instalación y ejecución

---

## Resumen de participación

| Área | Integrante 1 | Integrante 2 | Integrante 3 |
|---|---|---|---|
| HTML semántico | ✅ Principal | — | — |
| CSS y responsive | ✅ Principal | — | — |
| JavaScript / lógica | — | ✅ Principal | — |
| Validaciones y formularios | — | ✅ Principal | — |
| Base de datos SQL | — | — | ✅ Principal |
| Backend Node.js / API | — | ✅ Integración | ✅ Principal |
| Hosting y despliegue | — | — | ✅ Principal |
| Documentación | ✅ Revisión | ✅ Pruebas | ✅ Principal |
| Diseño visual | ✅ Principal | — | — |
