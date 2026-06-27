# Plan de pruebas funcionales y responsive

## Pruebas funcionales

| ID | Prueba | Pasos | Resultado esperado |
|---|---|---|---|
| PF-01 | Registro de usuario | Ingresar datos válidos y aceptar condiciones | Cuenta creada, sesión iniciada y contador actualizado |
| PF-02 | Correo duplicado | Registrar un correo existente | Mensaje de error y cuenta no duplicada |
| PF-03 | Inicio correcto | Usar credenciales de administrador | Sesión iniciada y botón Panel visible |
| PF-04 | Inicio incorrecto | Usar contraseña errónea | Mensaje de credenciales incorrectas |
| PF-05 | Recuperación | Ingresar correo existente y contraseña válida | Contraseña actualizada |
| PF-06 | Inscripción | Elegir actividad con cupos y completar datos | Confirmación y disminución de cupos |
| PF-07 | Inscripción duplicada | Repetir correo en la misma actividad | Sistema bloquea la segunda inscripción |
| PF-08 | Cupos agotados | Revisar Taller de Pintura | Botón deshabilitado y mensaje Cupos agotados |
| PF-09 | Filtro de actividades | Seleccionar Voluntariado | Solo aparecen actividades de voluntariado |
| PF-10 | Galería | Filtrar y abrir una imagen | Se muestran imágenes de la categoría y lightbox |
| PF-11 | Contacto | Enviar formulario completo | Consulta registrada y visible en panel |
| PF-12 | FAQ | Presionar una pregunta | Respuesta se expande y contrae |
| PF-13 | Chat | Preguntar por cupos | Respuesta automática relacionada |
| PF-14 | Crear actividad | Panel > Actividades > guardar | Actividad visible en sitio y panel |
| PF-15 | Editar noticia | Panel > Noticias > editar | Contenido actualizado en Novedades |
| PF-16 | Cargar galería | Panel > Galería > archivo o URL | Imagen visible en la galería |
| PF-17 | Cambiar rol | Administrador > Usuarios | Rol cambia de Visitante a Editor o Administrador |
| PF-18 | Exportar | Panel > Exportar datos JSON | Navegador descarga archivo JSON |

## Pruebas responsive

| Dispositivo | Resolución sugerida | Verificación |
|---|---:|---|
| Celular pequeño | 360 × 800 | Menú hamburguesa, una columna, botones completos y sin desplazamiento horizontal |
| Celular estándar | 390 × 844 | Hero, tarjetas, formularios y chat visibles |
| Tablet vertical | 768 × 1024 | Dos columnas cuando corresponde y navegación móvil |
| Tablet horizontal | 1024 × 768 | Contenido equilibrado y filtros legibles |
| Notebook | 1366 × 768 | Navegación completa, tres columnas y panel administrativo usable |
| Escritorio | 1920 × 1080 | Ancho máximo controlado y contenido centrado |

## Criterios de aceptación

- No existen errores de JavaScript en la consola durante el flujo normal.
- No existe desplazamiento horizontal no intencional.
- Todos los formularios entregan retroalimentación.
- Los botones deshabilitados no ejecutan acciones.
- Los roles restringen las opciones administrativas visibles.
- El sitio continúa funcionando después de recargar porque conserva LocalStorage.
