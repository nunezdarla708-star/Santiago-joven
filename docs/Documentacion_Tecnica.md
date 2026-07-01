# Documentación técnica

## 1. Tecnologías

- HTML5 semántico.
- CSS3 con variables, Grid, Flexbox y media queries.
- JavaScript ES6 sin frameworks.
- LocalStorage para persistencia de demostración (fallback cuando el backend no está disponible).
- Node.js con Express para la API REST productiva.
- SQL Server (T-SQL) como base de datos relacional.
- Netlify para hosting del frontend estático.

## 2. Estructura

```text
SantiagoJoven/
├── index.html
├── styles.css
├── script.js
├── assets/
│   └── banner.png
├── database/
│   └── schema.sql
├── docs/
│   ├── Informe_Proyecto.md
│   ├── Documentacion_Tecnica.md
│   ├── Pruebas_Funcionales.md
│   └── Evidencias.md
├── netlify.toml
└── README.md
```

## 3. Módulos JavaScript

El archivo `script.js` está encapsulado en una función autoejecutable para evitar variables globales.

### Persistencia

Las claves LocalStorage separan usuarios, actividades, inscripciones, galería, noticias, soporte, encuestas y sesión. Al primer ingreso se generan datos de demostración.

### Autenticación demostrativa

El sistema compara correo normalizado y un hash local simple. Este mecanismo sirve para evaluación visual y funcional, pero no tiene seguridad suficiente para producción.

### Control de acceso

- `visitor`: navegación e inscripciones.
- `editor`: gestión de contenidos.
- `admin`: gestión completa y roles.

Los botones administrativos se ocultan de acuerdo con la sesión. En producción, el backend debe volver a verificar cada permiso.

### Cupos

El total inscrito se calcula sumando el valor inicial de cada actividad y los registros nuevos almacenados. Antes de guardar una inscripción se vuelve a comprobar la disponibilidad para evitar superar la capacidad.

### Galería

Admite una URL externa o una imagen local. Los archivos locales se transforman a Data URL y se guardan en LocalStorage. Se recomienda no superar 1,5 MB. En producción deben subirse a almacenamiento de objetos.

### Exportación

El panel ofrece un modal con opciones para elegir qué datos exportar (todo, actividades, inscripciones, inscripciones de una actividad específica, usuarios, noticias, encuestas, soporte) y en qué formato (JSON o CSV compatible con Excel). Los hashes de contraseña y archivos de imagen locales se omiten del archivo exportado.

## 4. Validaciones

- Campos obligatorios con validación HTML5.
- Normalización de correo en minúsculas.
- Contraseña mínima de ocho caracteres con letras y números.
- Prevención de correo duplicado al registrar cuentas.
- Prevención de inscripción duplicada.
- Revisión de disponibilidad antes de confirmar inscripción.
- Límite de tamaño para imágenes cargadas.
- Escape de datos al generar contenido HTML.

## 5. Responsive

- Escritorio: cuadrículas de tres columnas y panel lateral.
- Tablet: cuadrículas de dos columnas y navegación móvil.
- Celular: una columna, formularios apilados y panel administrativo de pantalla completa.

Puntos principales: 1040 px, 800 px y 560 px.

## 6. Recomendación de arquitectura productiva

```text
Navegador
   │ HTTPS
API REST / Backend
   ├── Autenticación y autorización
   ├── Gestión de actividades y cupos con transacciones
   ├── Envío de correos
   └── Carga segura de imágenes
        │
Base de datos SQL + almacenamiento de archivos
```

Recomendaciones:

- Contraseñas con Argon2 o bcrypt.
- Tokens de sesión seguros en cookies HttpOnly.
- Validación de entrada en servidor.
- Restricciones únicas en usuarios e inscripciones.
- Transacciones para reservar cupos.
- Registro de auditoría.
- Copias de seguridad.
- Política de privacidad y consentimiento.
