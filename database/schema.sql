-- ============================================================
-- APOYO JOVEN — Script T-SQL para SQL Server 2016 o superior
-- Ejecutar completo en SQL Server Management Studio (SSMS)
-- ============================================================

-- ── 1. CREAR BASE DE DATOS ──────────────────────────────────
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'apoyo_joven')
BEGIN
    CREATE DATABASE apoyo_joven
        COLLATE Modern_Spanish_CI_AI;   -- mayúsculas/acentos en español
END
GO

USE apoyo_joven;
GO

-- ── 2. TABLA: roles ─────────────────────────────────────────
IF OBJECT_ID('roles', 'U') IS NULL
CREATE TABLE roles (
    id     TINYINT        IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(30)    NOT NULL,
    CONSTRAINT uq_roles_nombre UNIQUE (nombre)
);
GO

-- ── 3. TABLA: usuarios ──────────────────────────────────────
IF OBJECT_ID('usuarios', 'U') IS NULL
CREATE TABLE usuarios (
    id                  BIGINT          IDENTITY(1,1) PRIMARY KEY,
    nombre              VARCHAR(60)     NOT NULL,
    apellido            VARCHAR(60)     NOT NULL,
    correo              VARCHAR(120)    NOT NULL,
    password_hash       VARCHAR(255)    NOT NULL,
    telefono            VARCHAR(25)     NULL,
    fecha_nacimiento    DATE            NULL,
    rol_id              TINYINT         NOT NULL,
    activo              BIT             NOT NULL DEFAULT 1,
    fecha_creacion      DATETIME2       NOT NULL DEFAULT GETDATE(),
    fecha_actualizacion DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT uq_usuarios_correo   UNIQUE (correo),
    CONSTRAINT fk_usuarios_roles    FOREIGN KEY (rol_id) REFERENCES roles(id)
);
GO

-- Trigger para actualizar fecha_actualizacion automáticamente en usuarios
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
    id                  BIGINT          IDENTITY(1,1) PRIMARY KEY,
    nombre              VARCHAR(120)    NOT NULL,
    descripcion         NVARCHAR(MAX)   NOT NULL,
    categoria           VARCHAR(20)     NOT NULL,
    fecha               DATE            NOT NULL,
    hora                TIME            NOT NULL,
    lugar               VARCHAR(160)    NOT NULL,
    cupos               SMALLINT        NOT NULL,
    publicada           BIT             NOT NULL DEFAULT 1,
    creado_por          BIGINT          NOT NULL,
    fecha_creacion      DATETIME2       NOT NULL DEFAULT GETDATE(),
    fecha_actualizacion DATETIME2       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT chk_actividades_categoria CHECK (
        categoria IN ('formacion','recreacion','voluntariado','preuniversitario')
    ),
    CONSTRAINT chk_actividades_cupos CHECK (cupos > 0),
    CONSTRAINT fk_actividades_usuario FOREIGN KEY (creado_por) REFERENCES usuarios(id)
);
GO

-- Trigger para actualizar fecha_actualizacion automáticamente en actividades
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
IF OBJECT_ID('inscripciones', 'U') IS NULL
CREATE TABLE inscripciones (
    id               BIGINT       IDENTITY(1,1) PRIMARY KEY,
    actividad_id     BIGINT       NOT NULL,
    usuario_id       BIGINT       NULL,
    nombre           VARCHAR(120) NOT NULL,
    correo           VARCHAR(120) NOT NULL,
    telefono         VARCHAR(25)  NULL,
    estado           VARCHAR(15)  NOT NULL DEFAULT 'confirmada',
    fecha_inscripcion DATETIME2   NOT NULL DEFAULT GETDATE(),
    CONSTRAINT uq_inscripcion_correo    UNIQUE (actividad_id, correo),
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
    id                BIGINT         IDENTITY(1,1) PRIMARY KEY,
    titulo            VARCHAR(150)   NOT NULL,
    contenido         NVARCHAR(MAX)  NOT NULL,
    fecha_publicacion DATE           NOT NULL,
    publicada         BIT            NOT NULL DEFAULT 1,
    autor_id          BIGINT         NOT NULL,
    fecha_creacion    DATETIME2      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT fk_noticias_autor FOREIGN KEY (autor_id) REFERENCES usuarios(id)
);
GO

-- ── 7. TABLA: galeria ───────────────────────────────────────
IF OBJECT_ID('galeria', 'U') IS NULL
CREATE TABLE galeria (
    id             BIGINT        IDENTITY(1,1) PRIMARY KEY,
    imagen_url     VARCHAR(500)  NOT NULL,
    descripcion    VARCHAR(180)  NOT NULL,
    categoria      VARCHAR(15)   NOT NULL,
    publicada      BIT           NOT NULL DEFAULT 1,
    cargada_por    BIGINT        NOT NULL,
    fecha_creacion DATETIME2     NOT NULL DEFAULT GETDATE(),
    CONSTRAINT chk_galeria_categoria CHECK (
        categoria IN ('voluntariado','educacion','recreacion','cultura')
    ),
    CONSTRAINT fk_galeria_usuario FOREIGN KEY (cargada_por) REFERENCES usuarios(id)
);
GO

-- ── 8. TABLA: encuestas ─────────────────────────────────────
IF OBJECT_ID('encuestas', 'U') IS NULL
CREATE TABLE encuestas (
    id             BIGINT        IDENTITY(1,1) PRIMARY KEY,
    titulo         VARCHAR(150)  NOT NULL,
    activa         BIT           NOT NULL DEFAULT 1,
    fecha_creacion DATETIME2     NOT NULL DEFAULT GETDATE()
);
GO

-- ── 9. TABLA: respuestas_encuesta ───────────────────────────
IF OBJECT_ID('respuestas_encuesta', 'U') IS NULL
CREATE TABLE respuestas_encuesta (
    id             BIGINT        IDENTITY(1,1) PRIMARY KEY,
    encuesta_id    BIGINT        NOT NULL,
    usuario_id     BIGINT        NULL,
    calificacion   TINYINT       NOT NULL,
    comentario     VARCHAR(500)  NULL,
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
    id               BIGINT        IDENTITY(1,1) PRIMARY KEY,
    usuario_id       BIGINT        NULL,
    nombre           VARCHAR(120)  NOT NULL,
    correo           VARCHAR(120)  NOT NULL,
    motivo           VARCHAR(100)  NOT NULL,
    mensaje          NVARCHAR(MAX) NOT NULL,
    estado           VARCHAR(15)   NOT NULL DEFAULT 'pendiente',
    fecha_creacion   DATETIME2     NOT NULL DEFAULT GETDATE(),
    fecha_resolucion DATETIME2     NULL,
    CONSTRAINT chk_soporte_estado CHECK (
        estado IN ('pendiente','en_revision','resuelto')
    ),
    CONSTRAINT fk_soporte_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE SET NULL
);
GO

-- ── 11. TABLA: recuperacion_acceso ──────────────────────────
IF OBJECT_ID('recuperacion_acceso', 'U') IS NULL
CREATE TABLE recuperacion_acceso (
    id             BIGINT        IDENTITY(1,1) PRIMARY KEY,
    usuario_id     BIGINT        NOT NULL,
    token_hash     VARCHAR(255)  NOT NULL,
    expira_en      DATETIME2     NOT NULL,
    utilizado      BIT           NOT NULL DEFAULT 0,
    fecha_creacion DATETIME2     NOT NULL DEFAULT GETDATE(),
    CONSTRAINT uq_recuperacion_token  UNIQUE (token_hash),
    CONSTRAINT fk_recuperacion_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE
);
GO

-- ── 12. ÍNDICES ─────────────────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_actividades_fecha')
    CREATE INDEX idx_actividades_fecha
        ON actividades(fecha, publicada);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_inscripciones_actividad_estado')
    CREATE INDEX idx_inscripciones_actividad_estado
        ON inscripciones(actividad_id, estado);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'idx_soporte_estado_fecha')
    CREATE INDEX idx_soporte_estado_fecha
        ON mensajes_soporte(estado, fecha_creacion);
GO

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- Roles (solo insertar si la tabla está vacía)
IF NOT EXISTS (SELECT 1 FROM roles)
BEGIN
    INSERT INTO roles (nombre) VALUES
        ('Administrador'),
        ('Editor'),
        ('Visitante');
END
GO

-- Usuarios de demostración
IF NOT EXISTS (SELECT 1 FROM usuarios WHERE correo = 'admin@apoyojoven.cl')
BEGIN
    INSERT INTO usuarios (nombre, apellido, correo, password_hash, rol_id)
    VALUES ('Administración', 'Apoyo Joven', 'admin@apoyojoven.cl',
            'demo_hash_admin_123', 1);
END
GO

IF NOT EXISTS (SELECT 1 FROM usuarios WHERE correo = 'editor@apoyojoven.cl')
BEGIN
    INSERT INTO usuarios (nombre, apellido, correo, password_hash, rol_id)
    VALUES ('Editor', 'Contenidos', 'editor@apoyojoven.cl',
            'demo_hash_editor_123', 2);
END
GO

-- Actividades de demostración
IF NOT EXISTS (SELECT 1 FROM actividades)
BEGIN
    INSERT INTO actividades (nombre, descripcion, categoria, fecha, hora, lugar, cupos, creado_por)
    VALUES
    ('Taller Excel Básico',
     'Aprende fórmulas, formato de tablas, filtros y funciones esenciales para estudiar o trabajar.',
     'formacion', '2026-07-04', '10:00', 'Laboratorio de Computación, sede central', 40, 1),

    ('Encuentro de Básquetbol Juvenil',
     'Jornada recreativa con equipos mixtos, ejercicios de técnica y partidos amistosos.',
     'recreacion', '2026-07-11', '16:00', 'Gimnasio comunitario', 30, 1),

    ('Jornada de Limpieza Comunitaria',
     'Actividad de recuperación de espacios públicos, clasificación de residuos y educación ambiental.',
     'voluntariado', '2026-07-18', '09:30', 'Parque urbano, acceso norte', 50, 1),

    ('Preuniversitario Competencia Lectora',
     'Reforzamiento semanal de comprensión, vocabulario contextual y análisis de textos.',
     'preuniversitario', '2026-07-06', '18:30', 'Sala 204, sede Santo Tomás', 35, 1),

    ('Preuniversitario Matemática M1',
     'Resolución guiada de ejercicios de números, álgebra, geometría y probabilidad.',
     'preuniversitario', '2026-07-07', '18:30', 'Sala 205, sede Santo Tomás', 35, 1),

    ('Taller de Pintura y Expresión',
     'Espacio creativo para experimentar con color, composición y expresión personal.',
     'recreacion', '2026-07-25', '11:00', 'Centro cultural juvenil', 24, 1),

    ('Currículum y Entrevista Laboral',
     'Prepara un currículum efectivo y practica respuestas para entrevistas laborales.',
     'formacion', '2026-08-01', '10:30', 'Sala multiuso municipal', 32, 1),

    ('Voluntariado de Apoyo Escolar',
     'Acompañamiento de lectura y matemáticas para estudiantes de enseñanza básica.',
     'voluntariado', '2026-08-08', '10:00', 'Biblioteca comunitaria', 20, 1);
END
GO

-- Noticias de demostración
IF NOT EXISTS (SELECT 1 FROM noticias)
BEGIN
    INSERT INTO noticias (titulo, contenido, fecha_publicacion, autor_id)
    VALUES
    ('Inscripciones abiertas para talleres de invierno',
     'Ya puedes revisar los cupos de formación, recreación, voluntariado y preuniversitario.',
     '2026-06-20', 2),

    ('Nueva sección de soporte y preguntas frecuentes',
     'El sitio incorpora formulario de contacto, recuperación de acceso y ayuda rápida.',
     '2026-06-18', 2),

    ('Galería renovada con categorías',
     'Las fotografías se organizan por voluntariado, educación, recreación y cultura.',
     '2026-06-15', 2);
END
GO

-- Galería de demostración
IF NOT EXISTS (SELECT 1 FROM galeria)
BEGIN
    INSERT INTO galeria (imagen_url, descripcion, categoria, cargada_por)
    VALUES
    ('https://images.unsplash.com/photo-1758599667718-684569efe224?w=800&q=60',
     'Compromiso con el entorno', 'voluntariado', 2),

    ('https://images.unsplash.com/photo-1706841533830-f0bba6c45320?w=800&q=60',
     'Deporte y vida saludable', 'recreacion', 2),

    ('https://images.unsplash.com/photo-1747953273815-28f12a19ef0d?w=800&q=60',
     'Aprendizaje colaborativo', 'educacion', 2),

    ('https://images.unsplash.com/photo-1757085242652-f8cd4d3de889?w=800&q=60',
     'Taller creativo', 'cultura', 2);
END
GO

-- Encuesta inicial
IF NOT EXISTS (SELECT 1 FROM encuestas)
BEGIN
    INSERT INTO encuestas (titulo)
    VALUES ('¿Qué te pareció la experiencia en Apoyo Joven?');
END
GO

-- ============================================================
-- CONSULTAS DE VERIFICACIÓN
-- Ejecuta estas líneas para confirmar que todo quedó creado.
-- ============================================================

-- SELECT * FROM roles;
-- SELECT * FROM usuarios;
-- SELECT * FROM actividades;
-- SELECT * FROM noticias;
-- SELECT * FROM galeria;
-- SELECT * FROM encuestas;
-- SELECT * FROM inscripciones;
-- SELECT * FROM mensajes_soporte;
-- SELECT * FROM respuestas_encuesta;
