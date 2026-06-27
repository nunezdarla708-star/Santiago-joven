# Evidencias del proyecto — Apoyo Joven

## Capturas de pantalla requeridas

Toma las capturas con la URL publicada visible cuando sea posible (Netlify o GitHub Pages).

---

## Lista de evidencias mínimas

| N° | Descripción | Nombre de archivo sugerido |
|---|---|---|
| 01 | Página principal en computador: hero, menú y tarjetas de actividades | `01_inicio_escritorio.png` |
| 02 | Vista celular: menú hamburguesa abierto y actividades en una columna | `02_menu_celular.png` |
| 03 | Vista tablet: galería o programas adaptados a dos columnas | `03_vista_tablet.png` |
| 04 | Registro de usuario: formulario completo y mensaje de éxito | `04_registro_usuario.png` |
| 05 | Inicio de sesión administrador: nombre de sesión y botón Panel visible | `05_login_admin.png` |
| 06 | Sistema de cupos: actividad con cupos disponibles y otra con cupos agotados | `06_control_cupos.png` |
| 07 | Inscripción: formulario completado y mensaje de confirmación | `07_inscripcion_exitosa.png` |
| 08 | Panel administrativo — sección Actividades: formulario y listado | `08_panel_actividades.png` |
| 09 | Panel administrativo — sección Galería: carga de imagen y listado | `09_panel_galeria.png` |
| 10 | Galería pública: filtro aplicado e imagen ampliada en lightbox | `10_galeria_lightbox.png` |
| 11 | Soporte: formulario enviado y consulta visible en panel | `11_soporte.png` |
| 12 | Noticias: noticia creada desde panel y publicada en la sección | `12_noticias.png` |
| 13 | Base de datos: captura del archivo `database/schema.sql` en el editor | `13_modelo_sql.png` |
| 14 | GitHub: repositorio con todos los archivos cargados | `14_repositorio_github.png` |
| 15 | Hosting: página publicada con URL funcional (Netlify o GitHub Pages) | `15_url_hosting.png` |
| 16 | Pruebas responsive: herramientas de desarrollador mostrando 390×844, 768×1024 y 1366×768 | `16_pruebas_responsive.png` |

---

## Tabla de resultados de pruebas funcionales

Completar esta tabla al realizar las pruebas antes de la entrega:

| ID | Módulo | Acción ejecutada | Resultado obtenido | Estado | Captura |
|---|---|---|---|---|---|
| PF-01 | Registro | Ingresar datos válidos y aceptar condiciones | Cuenta creada, sesión iniciada y contador actualizado | ☐ Aprobada / ☐ Rechazada | `04_registro_usuario.png` |
| PF-02 | Registro | Intentar registrar un correo ya existente | Mensaje de error, no se crea cuenta duplicada | ☐ Aprobada / ☐ Rechazada | — |
| PF-03 | Login | Usar credenciales de administrador correctas | Sesión iniciada, botón "Panel" visible | ☐ Aprobada / ☐ Rechazada | `05_login_admin.png` |
| PF-04 | Login | Usar contraseña incorrecta | Mensaje "Correo o contraseña incorrectos" | ☐ Aprobada / ☐ Rechazada | — |
| PF-05 | Recuperación | Ingresar correo existente y contraseña válida | Contraseña actualizada correctamente | ☐ Aprobada / ☐ Rechazada | — |
| PF-06 | Inscripción | Elegir actividad con cupos y completar formulario | Confirmación y disminución visible de cupos | ☐ Aprobada / ☐ Rechazada | `07_inscripcion_exitosa.png` |
| PF-07 | Inscripción | Repetir el mismo correo en la misma actividad | Sistema bloquea la segunda inscripción | ☐ Aprobada / ☐ Rechazada | — |
| PF-08 | Cupos | Revisar actividad "Taller de Pintura y Expresión" | Botón deshabilitado y mensaje "Cupos agotados" | ☐ Aprobada / ☐ Rechazada | `06_control_cupos.png` |
| PF-09 | Filtros | Seleccionar filtro "Voluntariado" en actividades | Solo se muestran actividades de voluntariado | ☐ Aprobada / ☐ Rechazada | — |
| PF-10 | Galería | Filtrar por categoría y abrir imagen | Se muestran imágenes filtradas y lightbox funciona | ☐ Aprobada / ☐ Rechazada | `10_galeria_lightbox.png` |
| PF-11 | Soporte | Enviar formulario de contacto completo | Consulta registrada y visible en panel | ☐ Aprobada / ☐ Rechazada | `11_soporte.png` |
| PF-12 | FAQ | Hacer clic en una pregunta frecuente | Respuesta se expande; segundo clic la contrae | ☐ Aprobada / ☐ Rechazada | — |
| PF-13 | Chat | Preguntar por cupos o inscripciones | Respuesta automática relacionada al tema | ☐ Aprobada / ☐ Rechazada | — |
| PF-14 | Panel | Crear nueva actividad desde Panel → Actividades | Actividad visible en el sitio y en el listado del panel | ☐ Aprobada / ☐ Rechazada | `08_panel_actividades.png` |
| PF-15 | Panel | Editar noticia desde Panel → Noticias | Contenido actualizado en la sección Novedades | ☐ Aprobada / ☐ Rechazada | `12_noticias.png` |
| PF-16 | Panel | Cargar imagen (archivo o URL) desde Panel → Galería | Imagen visible en galería pública | ☐ Aprobada / ☐ Rechazada | `09_panel_galeria.png` |
| PF-17 | Usuarios | Administrador cambia rol de Visitante a Editor | Rol actualizado en la tabla de usuarios | ☐ Aprobada / ☐ Rechazada | — |
| PF-18 | Exportar | Panel → Exportar datos JSON | Navegador descarga archivo `.json` con los datos | ☐ Aprobada / ☐ Rechazada | — |

---

## Pruebas responsive

| Dispositivo | Resolución | Estado |
|---|---|---|
| Celular pequeño | 360 × 800 | ☐ Aprobada / ☐ Rechazada |
| Celular estándar (iPhone 14) | 390 × 844 | ☐ Aprobada / ☐ Rechazada |
| Tablet vertical (iPad) | 768 × 1024 | ☐ Aprobada / ☐ Rechazada |
| Tablet horizontal | 1024 × 768 | ☐ Aprobada / ☐ Rechazada |
| Notebook | 1366 × 768 | ☐ Aprobada / ☐ Rechazada |
| Escritorio | 1920 × 1080 | ☐ Aprobada / ☐ Rechazada |

---

## Repositorio GitHub

- URL del repositorio: `https://github.com/nunezdarla708-star/Santiago-joven`
- Rama principal: `main`
- Archivos incluidos: `index.html`, `styles.css`, `script.js`, `assets/`, `database/`, `docs/`, `netlify.toml`, `README.md`

---

## Hosting

- Plataforma: Netlify
- URL publicada: `https://inspiring-truffle-0a3982.netlify.app`
- Fecha de publicación: Junio 2026

---

## Notas de evidencia

- Las capturas deben tomarse con el navegador en modo normal (no en modo incógnito).
- Para pruebas responsive usar las DevTools del navegador (F12 → icono de dispositivo móvil).
- Guardar todas las imágenes en una carpeta `capturas/` dentro del proyecto o en el informe de entrega.
