# Stack Tecnológico y Justificación — Santiago Joven

## Tecnologías utilizadas

---

### Frontend

#### HTML5 semántico
**Justificación:** HTML5 permite estructurar el contenido con etiquetas semánticas (`header`, `nav`, `main`, `section`, `article`, `footer`), lo que mejora la accesibilidad y el posicionamiento. No requiere compilación ni dependencias, facilitando el despliegue estático.

#### CSS3 con variables, Grid y Flexbox
**Justificación:** CSS puro con variables (`--primary`, `--surface`, `--radius`) permite mantener un sistema de diseño coherente sin frameworks externos. Grid y Flexbox cubren todos los layouts necesarios y los media queries permiten el diseño responsive sin librerías adicionales. Esto reduce el tamaño del sitio y elimina dependencias de terceros.

#### JavaScript ES6 (sin frameworks)
**Justificación:** El proyecto no requería la complejidad de React, Vue o Angular. JavaScript puro permite controlar exactamente qué se ejecuta, cuándo y cómo, sin overhead de framework. La encapsulación en función autoejecutable (`IIFE`) evita variables globales y mantiene el código limpio y predecible.

---

### Backend

#### Node.js con Express
**Justificación:** Node.js permite usar JavaScript en el servidor, reduciendo la curva de aprendizaje del equipo. Express es el framework más utilizado para APIs REST con Node.js, minimalista y bien documentado. Permite crear rutas, manejar JSON y conectar con bases de datos de forma directa.

#### mssql / msnodesqlv8
**Justificación:** Librería oficial para conectar Node.js con SQL Server mediante ODBC. Soporta autenticación de Windows (Trusted Connection), transacciones, parámetros tipados y prevención de inyección SQL. Es la opción recomendada para proyectos académicos y empresariales con SQL Server en Windows.

#### CORS
**Justificación:** Permite que el frontend (corriendo en `localhost:5500` o en Netlify) pueda hacer peticiones al backend sin ser bloqueado por la política de seguridad del navegador.

---

### Base de datos

#### SQL Server Express (con autenticación de Windows)
**Justificación:** SQL Server es el motor de base de datos más utilizado en entornos Windows y empresariales chilenos. La versión Express es gratuita y suficiente para proyectos académicos y medianos. La autenticación de Windows elimina la necesidad de gestionar credenciales de base de datos en el código. El lenguaje T-SQL ofrece transacciones, constraints, triggers y procedimientos almacenados que garantizan integridad de los datos.

**Características utilizadas:**
- `IDENTITY(1,1)` para claves primarias autoincrementales
- `CONSTRAINT CHECK` para simular ENUM (categorías de actividades)
- `WITH (UPDLOCK, HOLDLOCK)` en transacciones para evitar condición de carrera en reserva de cupos
- Triggers `AFTER UPDATE` para mantener `fecha_actualizacion` automáticamente
- `IF NOT EXISTS` en todos los objetos para permitir ejecución idempotente del script

---

### Persistencia del cliente

#### LocalStorage
**Justificación:** Para la versión de demostración estática (Netlify), LocalStorage permite que el sitio funcione completamente en el navegador sin servidor. Los datos persisten entre sesiones y permiten demostrar todas las funcionalidades sin necesidad de una conexión activa al backend. En la versión con backend, LocalStorage actúa como respaldo cuando el servidor no está disponible.

---

### Hosting y despliegue

#### Netlify
**Justificación:** Netlify ofrece hosting gratuito para sitios estáticos con despliegue por arrastrar la carpeta, CDN global, HTTPS automático y URL pública inmediata. No requiere configuración de servidor, es ideal para proyectos académicos y permite que el socio comunitario acceda al sitio desde cualquier dispositivo sin instalación.

- **URL publicada:** https://santiagojoven.netlify.app
- **Configuración:** `netlify.toml` con cabeceras de seguridad y caché

---

### Herramientas de desarrollo

| Herramienta | Uso |
|---|---|
| Visual Studio Code | Editor principal de código |
| Live Server (extensión) | Servidor local para desarrollo |
| SQL Server Management Studio (SSMS) | Gestión y consultas a SQL Server |
| Chrome DevTools | Pruebas responsive y depuración JavaScript |
| Netlify | Despliegue y hosting del sitio estático |

---

## Justificación general de la elección

Se priorizaron tecnologías **sin frameworks complejos** para mantener el código comprensible, auditable y fácil de mantener por el socio comunitario o futuros desarrolladores. El stack HTML + CSS + JS + Node.js + SQL Server representa una solución completa y profesional que cubre:

- Frontend visual y accesible
- Lógica de negocio en el cliente (validaciones, roles, cupos)
- API REST para persistencia real en base de datos
- Modelo relacional robusto con integridad referencial
- Despliegue público sin costo

Esta combinación permite que **Santiago Joven pueda actualizar contenidos** (actividades, noticias, galería, usuarios) desde el panel administrativo del sitio, sin intervenir el código fuente, usando solo un navegador web.
