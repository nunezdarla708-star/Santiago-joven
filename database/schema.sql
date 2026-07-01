-- ============================================================
-- SANTIAGO JOVEN
-- Base de datos relacional para la plataforma web
-- Motor: SQL Server Express (T-SQL)
-- Ejecutar completo en SQL Server Management Studio (SSMS)
-- ============================================================

-- ── 1. CREAR BASE DE DATOS (seguro si ya existe) ────────────
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'Santiago_joven')
BEGIN
    CREATE DATABASE Santiago_joven
        COLLATE Modern_Spanish_CI_AI;
END
GO

USE Santiago_joven;
GO

-- ============================================================
-- TABLAS
-- ============================================================

-- ── 2. TABLA: roles ─────────────────────────────────────────
IF OBJECT_ID('roles', 'U') IS NULL
CREATE TABLE roles (
    id     TINYINT     IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    CONSTRAINT uq_roles_nombre UNIQUE (nombre)
);
GO

-- ── 3. TABLA: usuarios ──────────────────────────────────────
IF OBJECT_ID('usuarios', 'U') IS NULL
CREATE TABLE usuarios (
    id                  BIGINT      IDENTITY(1,1) PRIMARY KEY,
    nombre              VARCHAR(60)  NOT NULL,
    apellido            VARCHAR(60)  NOT NULL,
    correo              VARCHAR(120) NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    telefono            VARCHAR(25)  NULL,
    fecha_nacimiento    DATE         NULL,
    rol_id              TINYINT      NOT NULL,
    activo              BIT          NOT NULL DEFAULT 1,
    fecha_creacion      DATETIME2    NOT NULL DEFAULT GETDATE(),
    fecha_actualizacion DATETIME2    NOT NULL DEFAULT GETDATE(),
    CONSTRAINT uq_usuarios_correo UNIQUE (correo),
    CONSTRAINT fk_usuarios_roles  FOREIGN KEY (rol_id) REFERENCES roles(id)
);
GO

-- Trigger: actualiza fecha_actualizacion al modificar un usuario
IF OBJECT_ID('trg_usuarios_update', 'TR') IS NOT NULL
    DROP TRIGGER trg_usuarios_update;
GO
CREATE TRIGGER trg_usuarios_update
ON usuarios
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE usuarios
       SET fecha_actualizacion = GETDATE()
     WHERE id IN (SELECT id FROM inserted);
END;
GO

-- ── 4. TABLA: actividades ───────────────────────────────────
IF OBJECT_ID('actividades', 'U') IS NULL
CREATE TABLE actividades (
    id                  BIGINT       IDENTITY(1,1) PRIMARY KEY,
    nombre              VARCHAR(120) NOT NULL,
    descripcion         NVARCHAR(MAX) NOT NULL,
    categoria           VARCHAR(20)  NOT NULL,
    fecha               DATE         NOT NULL,
    hora                TIME         NOT NULL,
    lugar               VARCHAR(160) NOT NULL,
    cupos               SMALLINT     NOT NULL,
    publicada           BIT          NOT NULL DEFAULT 1,
    creado_por          BIGINT       NOT NULL,
    fecha_creacion      DATETIME2    NOT NULL DEFAULT GETDATE(),
    fecha_actualizacion DATETIME2    NOT NULL DEFAULT GETDATE(),
    CONSTRAINT chk_actividades_categoria CHECK (
        categoria IN ('formacion','recreacion','voluntariado','preuniversitario')
    ),
    CONSTRAINT chk_actividades_cupos CHECK (cupos > 0),
    CONSTRAINT fk_actividades_usuario FOREIGN KEY (creado_por) REFERENCES usuarios(id)
);
GO

-- Trigger: actualiza fecha_actualizacion al modificar una actividad
IF OBJECT_ID('trg_actividades_update', 'TR') IS NOT NULL
    DROP TRIGGER trg_actividades_update;
GO
CREATE TRIGGER trg_actividades_update
ON actividades
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE actividades
       SET fecha_actualizacion = GETDATE()
     WHERE id IN (SELECT id FROM inserted);
END;
GO

-- ── 5. TABLA: inscripciones ─────────────────────────────────
-- Un correo solo puede inscribirse una vez por actividad (constraint uq).
-- Las inscripciones usan transacción con UPDLOCK en el backend para
-- evitar condición de carrera al reservar el último cupo disponible.
IF OBJECT_ID('inscripciones', 'U') IS NULL
CREATE TABLE inscripciones (
    id                BIGINT       IDENTITY(1,1) PRIMARY KEY,
    actividad_id      BIGINT       NOT NULL,
    usuario_id        BIGINT       NULL,       -- NULL si se inscribe sin cuenta
    nombre            VARCHAR(120) NOT NULL,
    correo            VARCHAR(120) NOT NULL,
    telefono          VARCHAR(25)  NULL,
    estado            VARCHAR(15)  NOT NULL DEFAULT 'confirmada',
    fecha_inscripcion DATETIME2    NOT NULL DEFAULT GETDATE(),
    CONSTRAINT uq_inscripcion_correo_actividad UNIQUE (actividad_id, correo),
    CONSTRAINT chk_inscripciones_estado CHECK (
        estado IN ('confirmada','cancelada','lista_espera')
    ),
    CONSTRAINT fk_inscripciones_actividad FOREIGN KEY (actividad_id)
        REFERENCES actividades(id) ON DELETE CASCADE,
    CONSTRAINT fk_inscripciones_usuario  FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE SET NULL
);
GO

-- ── 6. TABLA: noticias ──────────────────────────────────────
IF OBJECT_ID('noticias', 'U') IS NULL
CREATE TABLE noticias (
    id                BIGINT       IDENTITY(1,1) PRIMARY KEY,
    titulo            VARCHAR(150) NOT NULL,
    contenido         NVARCHAR(MAX) NOT NULL,
    fecha_publicacion DATE         NOT NULL,
    publicada         BIT          NOT NULL DEFAULT 1,
    autor_id          BIGINT       NOT NULL,
    fecha_creacion    DATETIME2    NOT NULL DEFAULT GETDATE(),
    CONSTRAINT fk_noticias_autor FOREIGN KEY (autor_id) REFERENCES usuarios(id)
);
GO

-- ── 7. TABLA: galeria ───────────────────────────────────────
IF OBJECT_ID('galeria', 'U') IS NULL
CREATE TABLE galeria (
    id             BIGINT       IDENTITY(1,1) PRIMARY KEY,
    imagen_url     VARCHAR(500) NOT NULL,
    descripcion    VARCHAR(180) NOT NULL,
    categoria      VARCHAR(15)  NOT NULL,
    publicada      BIT          NOT NULL DEFAULT 1,
    cargada_por    BIGINT       NOT NULL,
    fecha_creacion DATETIME2    NOT NULL DEFAULT GETDATE(),
    CONSTRAINT chk_galeria_categoria CHECK (
        categoria IN ('voluntariado','educacion','recreacion','cultura')
    ),
    CONSTRAINT fk_galeria_usuario FOREIGN KEY (cargada_por) REFERENCES usuarios(id)
);
GO

-- ── 8. TABLA: encuestas ─────────────────────────────────────
IF OBJECT_ID('encuestas', 'U') IS NULL
CREATE TABLE encuestas (
    id             BIGINT       IDENTITY(1,1) PRIMARY KEY,
    titulo         VARCHAR(150) NOT NULL,
    activa         BIT          NOT NULL DEFAULT 1,
    fecha_creacion DATETIME2    NOT NULL DEFAULT GETDATE()
);
GO

-- ── 9. TABLA: respuestas_encuesta ───────────────────────────
IF OBJECT_ID('respuestas_encuesta', 'U') IS NULL
CREATE TABLE respuestas_encuesta (
    id              BIGINT       IDENTITY(1,1) PRIMARY KEY,
    encuesta_id     BIGINT       NOT NULL,
    usuario_id      BIGINT       NULL,
    calificacion    TINYINT      NOT NULL,
    comentario      VARCHAR(500) NULL,
    fecha_respuesta DATETIME2    NOT NULL DEFAULT GETDATE(),
    CONSTRAINT chk_calificacion CHECK (calificacion BETWEEN 1 AND 5),
    CONSTRAINT fk_respuesta_encuesta FOREIGN KEY (encuesta_id)
        REFERENCES encuestas(id) ON DELETE CASCADE,
    CONSTRAINT fk_respuesta_usuario  FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE SET NULL
);
GO

-- ── 10. TABLA: mensajes_soporte ─────────────────────────────
IF OBJECT_ID('mensajes_soporte', 'U') IS NULL
CREATE TABLE mensajes_soporte (
    id               BIGINT       IDENTITY(1,1) PRIMARY KEY,
    usuario_id       BIGINT       NULL,
    nombre           VARCHAR(120) NOT NULL,
    correo           VARCHAR(120) NOT NULL,
    motivo           VARCHAR(100) NOT NULL,
    mensaje          NVARCHAR(MAX) NOT NULL,
    estado           VARCHAR(15)  NOT NULL DEFAULT 'pendiente',
    fecha_creacion   DATETIME2    NOT NULL DEFAULT GETDATE(),
    fecha_resolucion DATETIME2    NULL,
    CONSTRAINT chk_soporte_estado CHECK (
        estado IN ('pendiente','en_revision','resuelto')
    ),
    CONSTRAINT fk_soporte_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE SET NULL
);
GO

-- ── 11. TABLA: recuperacion_acceso ──────────────────────────
-- Reservada para versión productiva con envío de correo real.
-- En la demo actual la recuperación es local (no usa esta tabla).
IF OBJECT_ID('recuperacion_acceso', 'U') IS NULL
CREATE TABLE recuperacion_acceso (
    id             BIGINT       IDENTITY(1,1) PRIMARY KEY,
    usuario_id     BIGINT       NOT NULL,
    token_hash     VARCHAR(255) NOT NULL,
    expira_en      DATETIME2    NOT NULL,
    utilizado      BIT          NOT NULL DEFAULT 0,
    fecha_creacion DATETIME2    NOT NULL DEFAULT GETDATE(),
    CONSTRAINT uq_recuperacion_token   UNIQUE (token_hash),
    CONSTRAINT fk_recuperacion_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE
);
GO

-- ============================================================
-- ÍNDICES
-- ============================================================

-- Búsqueda de usuarios por correo (login)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_usuarios_correo')
    CREATE INDEX idx_usuarios_correo
        ON usuarios(correo);
GO

-- Actividades publicadas ordenadas por fecha
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_actividades_fecha')
    CREATE INDEX idx_actividades_fecha
        ON actividades(publicada, fecha);
GO

-- Inscripciones por actividad y estado (control de cupos)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_inscripciones_actividad_estado')
    CREATE INDEX idx_inscripciones_actividad_estado
        ON inscripciones(actividad_id, estado);
GO

-- Mensajes de soporte por estado y fecha
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_soporte_estado_fecha')
    CREATE INDEX idx_soporte_estado_fecha
        ON mensajes_soporte(estado, fecha_creacion);
GO

-- ============================================================
-- DATOS INICIALES (idempotente — seguro volver a ejecutar)
-- ============================================================

-- Roles del sistema
IF NOT EXISTS (SELECT 1 FROM roles)
BEGIN
    INSERT INTO roles (nombre) VALUES
        ('Administrador'),
        ('Editor'),
        ('Visitante');
END
GO

-- Usuarios de demostración
-- password_hash = hash FNV-1a de 'Santiago2026!' (función hashText en script.js)
-- Valor resultante: 471ab70c
-- En producción reemplazar por bcrypt con sal (nunca texto plano ni FNV-1a)
IF NOT EXISTS (SELECT 1 FROM usuarios WHERE correo = 'admin@munistgo.cl')
BEGIN
    INSERT INTO usuarios (nombre, apellido, correo, password_hash, rol_id)
    VALUES ('Administración', 'Santiago Joven', 'admin@munistgo.cl', '471ab70c', 1);
END
GO

IF NOT EXISTS (SELECT 1 FROM usuarios WHERE correo = 'editor@munistgo.cl')
BEGIN
    INSERT INTO usuarios (nombre, apellido, correo, password_hash, rol_id)
    VALUES ('Editor', 'Contenidos', 'editor@munistgo.cl', '471ab70c', 2);
END
GO

-- Actividades de demostración
IF NOT EXISTS (SELECT 1 FROM actividades)
BEGIN
    DECLARE @admin_id BIGINT = (SELECT id FROM usuarios WHERE correo = 'admin@munistgo.cl');

    INSERT INTO actividades (nombre, descripcion, categoria, fecha, hora, lugar, cupos, creado_por)
    VALUES
    ('Taller Excel Básico',
     'Aprende fórmulas, formato de tablas, filtros y funciones esenciales para estudiar o trabajar.',
     'formacion', '2026-07-04', '10:00', 'Laboratorio de Computación, sede central', 40, @admin_id),

    ('Encuentro de Básquetbol Juvenil',
     'Jornada recreativa con equipos mixtos, ejercicios de técnica y partidos amistosos.',
     'recreacion', '2026-07-11', '16:00', 'Gimnasio comunitario', 30, @admin_id),

    ('Jornada de Limpieza Comunitaria',
     'Actividad de recuperación de espacios públicos, clasificación de residuos y educación ambiental.',
     'voluntariado', '2026-07-18', '09:30', 'Parque urbano, acceso norte', 50, @admin_id),

    ('Preuniversitario Competencia Lectora',
     'Reforzamiento semanal de comprensión, vocabulario contextual y análisis de textos.',
     'preuniversitario', '2026-07-06', '18:30', 'Sala 204, sede Santo Tomás', 35, @admin_id),

    ('Preuniversitario Matemática M1',
     'Resolución guiada de ejercicios de números, álgebra, geometría y probabilidad.',
     'preuniversitario', '2026-07-07', '18:30', 'Sala 205, sede Santo Tomás', 35, @admin_id),

    ('Taller de Pintura y Expresión',
     'Espacio creativo para experimentar con color, composición y expresión personal.',
     'recreacion', '2026-07-25', '11:00', 'Centro cultural juvenil', 24, @admin_id),

    ('Currículum y Entrevista Laboral',
     'Prepara un currículum efectivo y practica respuestas para entrevistas laborales.',
     'formacion', '2026-08-01', '10:30', 'Sala multiuso municipal', 32, @admin_id),

    ('Voluntariado de Apoyo Escolar',
     'Acompañamiento de lectura y matemáticas para estudiantes de enseñanza básica.',
     'voluntariado', '2026-08-08', '10:00', 'Biblioteca comunitaria', 20, @admin_id);
END
GO

-- Noticias de demostración
IF NOT EXISTS (SELECT 1 FROM noticias)
BEGIN
    DECLARE @editor_id BIGINT = (SELECT id FROM usuarios WHERE correo = 'editor@munistgo.cl');

    INSERT INTO noticias (titulo, contenido, fecha_publicacion, autor_id)
    VALUES
    ('Inscripciones abiertas para talleres de invierno',
     'Ya puedes revisar los cupos de formación, recreación, voluntariado y preuniversitario desde la sección de actividades.',
     '2026-06-20', @editor_id),

    ('Nueva sección de soporte y preguntas frecuentes',
     'El sitio incorpora formulario de contacto, recuperación de acceso y ayuda rápida para orientar a los usuarios.',
     '2026-06-18', @editor_id),

    ('Galería renovada con categorías',
     'Las fotografías ahora se organizan por voluntariado, educación, recreación y cultura, con visualización ampliada.',
     '2026-06-15', @editor_id);
END
GO

-- Galería de demostración
IF NOT EXISTS (SELECT 1 FROM galeria)
BEGIN
    DECLARE @editor_id2 BIGINT = (SELECT id FROM usuarios WHERE correo = 'editor@munistgo.cl');

    INSERT INTO galeria (imagen_url, descripcion, categoria, cargada_por)
    VALUES
    ('https://images.unsplash.com/photo-1758599667718-684569efe224?w=800&q=60',
     'Compromiso con el entorno', 'voluntariado', @editor_id2),

    ('https://images.unsplash.com/photo-1706841533830-f0bba6c45320?w=800&q=60',
     'Deporte y vida saludable', 'recreacion', @editor_id2),

    ('https://images.unsplash.com/photo-1747953273815-28f12a19ef0d?w=800&q=60',
     'Aprendizaje colaborativo', 'educacion', @editor_id2),

    ('https://images.unsplash.com/photo-1757085242652-f8cd4d3de889?w=800&q=60',
     'Taller creativo', 'cultura', @editor_id2);
END
GO

-- Encuesta inicial de satisfacción
IF NOT EXISTS (SELECT 1 FROM encuestas)
BEGIN
    INSERT INTO encuestas (titulo)
    VALUES ('¿Qué te pareció la experiencia en Santiago Joven?');
END
GO

-- ============================================================
-- CONSULTAS DE VERIFICACIÓN
-- Descomenta y ejecuta para confirmar que todo quedó creado.
-- ============================================================
-- SELECT * FROM roles;
-- SELECT * FROM usuarios;
-- SELECT * FROM actividades ORDER BY fecha;
-- SELECT * FROM noticias ORDER BY fecha_publicacion DESC;
-- SELECT * FROM galeria;
-- SELECT * FROM encuestas;
-- SELECT * FROM inscripciones ORDER BY fecha_inscripcion DESC;
-- SELECT * FROM mensajes_soporte ORDER BY fecha_creacion DESC;
-- SELECT * FROM respuestas_encuesta ORDER BY fecha_respuesta DESC;
