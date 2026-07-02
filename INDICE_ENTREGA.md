# Índice de entrega — Proyecto Santiago Joven
## Desarrollo Web I · IPChile · Sección 1014-1

---

## Integrantes

| N° | Nombre | Rol |
|---|---|---|
| 1 | Josselyn Sanchez | Diseño y frontend (HTML, CSS) |
| 2 | Katline Lauture | Programación y funcionalidades (JavaScript) |
| 3 | Darla Núñez | Base de datos, backend y despliegue |

---

## Acceso rápido al sitio

| Recurso | Enlace |
|---|---|
| **Sitio publicado (Netlify)** | https://inspiring-truffle-0a3982.netlify.app |
| **Repositorio GitHub** | https://github.com/nunezdarla708-star/Santiago-joven |

### Credenciales de prueba
| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@munistgo.cl | Santiago2026! |
| Editor | editor@munistgo.cl | Santiago2026! |

---

## Estructura de archivos entregados

```
Santiago.Joven_FINAL/
│
├── INDICE_ENTREGA.md          ← Este archivo (leer primero)
├── index.html                 ← Página principal del sitio
├── styles.css                 ← Estilos visuales
├── script.js                  ← Lógica JavaScript completa
├── netlify.toml               ← Configuración de despliegue
├── README.md                  ← Instrucciones técnicas completas
│
├── assets/
│   └── banner.png             ← Imagen principal del sitio
│
├── capturas/                  ← Evidencias visuales del proyecto
│   ├── 01_inicio_escritorio.png
│   ├── 02_menu_celular.png
│   ├── 03_vista_tablet.png
│   ├── 04_registro_usuario.png
│   ├── 04b_registro_confirmacion.png
│   ├── 05_login_admin.png
│   ├── 06_control_cupos.png
│   ├── 07_inscripcion_exitosa.png
│   ├── 08_panel_actividades.png
│   ├── 09_panel_galeria.png
│   ├── 10_galeria_lightbox.png
│   ├── 11_soporte.png
│   ├── 12_noticias.png
│   ├── 13_modelo_sql.png
│   ├── 14_repositorio_github.png
│   ├── 15_url_hosting.png
│   ├── 16_pruebas_responsive.png
│   └── 17_backend_ssms.png
│
├── database/
│   ├── schema.sql                        ← Modelo relacional SQL Server (10 tablas)
│   └── apoyo_joven_backend/
│       ├── index.js                      ← API REST Node.js (21 rutas)
│       └── package.json
│
└── docs/                                 ← Documentación completa
    ├── Roles_y_Responsabilidades.md
    ├── Stack_Tecnologico.md
    ├── Registro_Reuniones.md
    ├── Tablero_Tareas.md
    ├── Pruebas_Funcionales.md
    ├── Guia_Actualizacion_Contenidos.md
    ├── Documentacion_Tecnica.md
    ├── Evidencias.md
    └── Informe_Proyecto.md
```

---

## Cómo revisar el proyecto

### Opción 1 — Revisión rápida (sin instalar nada)
1. Abrir el enlace de Netlify: https://inspiring-truffle-0a3982.netlify.app
2. Ingresar con `admin@munistgo.cl` / `Santiago2026!`
3. Explorar el sitio y el panel administrativo

### Opción 2 — Revisión local con VS Code
1. Abrir la carpeta del proyecto en Visual Studio Code
2. Instalar la extensión **Live Server**
3. Clic derecho sobre `index.html` → **Open with Live Server**
4. El sitio abre en `http://localhost:5500`

### Opción 3 — Revisión con backend real (SQL Server)
Requiere SQL Server Express instalado.

1. Ejecutar `database/schema.sql` en SSMS para crear la base de datos
2. En terminal:
```
cd database/apoyo_joven_backend
npm install
npm start
```
3. Abrir el sitio con Live Server
4. El login y las inscripciones se guardan en SQL Server

---

## Documentos clave para la evaluación

| Criterio rúbrica | Documento |
|---|---|
| Roles y responsabilidades | `docs/Roles_y_Responsabilidades.md` |
| Metodología y reuniones | `docs/Registro_Reuniones.md` |
| Tablero de tareas | `docs/Tablero_Tareas.md` |
| Stack tecnológico | `docs/Stack_Tecnologico.md` |
| Base de datos y backend | `database/schema.sql` + `database/apoyo_joven_backend/index.js` |
| Pruebas funcionales | `docs/Pruebas_Funcionales.md` |
| Guía para Santiago Joven | `docs/Guia_Actualizacion_Contenidos.md` |
| Documentación técnica | `docs/Documentacion_Tecnica.md` |
| Evidencias visuales | `capturas/` |
| Instrucciones completas | `README.md` |

---

## Evidencias visuales destacadas

| Captura | Qué muestra |
|---|---|
| `05_login_admin.png` | Login exitoso con botón Panel visible |
| `06_control_cupos.png` | Control de cupos en tiempo real |
| `08_panel_actividades.png` | Panel administrativo funcional |
| `17_backend_ssms.png` | Inscripción guardada en SQL Server |
| `16_pruebas_responsive.png` | Diseño responsive verificado |
| `14_repositorio_github.png` | Repositorio con historial de commits |
