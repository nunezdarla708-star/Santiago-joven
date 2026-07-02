import express from 'express';
import sql from 'mssql/msnodesqlv8.js';
import cors from 'cors';

const app = express();

// Permitir peticiones desde el navegador (archivo local, Live Server, red local, Netlify)
app.use(cors({
  origin: [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5501',
    'http://127.0.0.1:5501',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.1.24:5500',  // celular en red local
    'http://192.168.1.24:5501',
    /\.netlify\.app$/,
    /\.github\.io$/
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false
}));
app.options('*', cors());
app.use(express.json());

// ─────────────────────────────────────────────
// CONFIGURACIÓN DE BASE DE DATOS (Windows Auth)
// ─────────────────────────────────────────────
const dbConfig = {
  connectionString:
    'Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-EI3QAO0\\SQLEXPRESS;Database=Santiago_joven;Trusted_Connection=Yes;'
};

let pool;
try {
  pool = await sql.connect(dbConfig);
  console.log('🔌 Conectado exitosamente a SQL Server (Autenticación de Windows)');
} catch (err) {
  console.error('❌ Error al conectar a la base de datos:');
  console.dir(err, { depth: null });
}

// ─────────────────────────────────────────────
// UTILIDAD: manejo de errores comunes SQL Server
// ─────────────────────────────────────────────
function handleSqlError(res, error, context = '') {
  console.error(`Error en ${context}:`, error);
  if (error.number === 2627 || error.number === 2601) {
    return res.status(400).json({ error: 'El registro ya existe (valor duplicado).' });
  }
  if (error.number === 547) {
    return res.status(400).json({ error: 'Referencia inválida. Verifica los datos enviados.' });
  }
  res.status(500).json({ error: `Error interno del servidor. (${context})` });
}

// ── Ruta de diagnóstico ─────────────────────────────────────
app.get('/api/ping', (_req, res) => {
  res.json({ status: 'ok', message: 'Backend Apoyo Joven activo', db: pool ? 'conectada' : 'sin conexión' });
});

// ══════════════════════════════════════════════
// MÓDULO: AUTENTICACIÓN
// ══════════════════════════════════════════════

// POST /api/login — Iniciar sesión (compara hash FNV-1a igual que el frontend)
app.post('/api/login', async (req, res) => {
  const { correo, password_hash } = req.body;
  if (!correo || !password_hash) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  try {
    const result = await pool.request()
      .input('correo', sql.VarChar(120), correo.toLowerCase().trim())
      .query(`
        SELECT u.id, u.nombre, u.apellido, u.correo, u.telefono,
               u.fecha_nacimiento, u.password_hash, u.activo,
               r.nombre AS rol
        FROM usuarios u
        INNER JOIN roles r ON u.rol_id = r.id
        WHERE u.correo = @correo AND u.activo = 1;
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const user = result.recordset[0];
    if (user.password_hash !== password_hash) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    res.json({
      status: 'success',
      user: {
        id:        String(user.id),
        name:      user.nombre,
        lastname:  user.apellido,
        email:     user.correo,
        phone:     user.telefono || '',
        birthdate: user.fecha_nacimiento || '',
        // Normalizar rol al formato que espera el frontend
        role: ({ 'Administrador': 'admin', 'Editor': 'editor', 'Visitante': 'visitor' })[user.rol] || 'visitor'
      }
    });
  } catch (error) {
    handleSqlError(res, error, 'POST /api/login');
  }
});

// ══════════════════════════════════════════════
// MÓDULO: ACTIVIDADES
// ══════════════════════════════════════════════

// GET /api/activities — Lista de actividades publicadas con conteo de cupos
app.get('/api/activities', async (_req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT
        a.id, a.nombre, a.descripcion, a.categoria,
        CONVERT(varchar(10), a.fecha, 120) AS fecha,
        CONVERT(varchar(5), a.hora, 108)  AS hora,
        a.lugar, a.cupos,
        COUNT(CASE WHEN i.estado = 'confirmada' THEN 1 END) AS inscritos
      FROM actividades a
      LEFT JOIN inscripciones i ON a.id = i.actividad_id
      WHERE a.publicada = 1
      GROUP BY a.id, a.nombre, a.descripcion, a.categoria,
               a.fecha, a.hora, a.lugar, a.cupos
      ORDER BY a.fecha ASC, a.hora ASC;
    `);
    res.json(result.recordset);
  } catch (error) {
    handleSqlError(res, error, 'GET /api/activities');
  }
});

// POST /api/activities — Crear una nueva actividad (requiere rol editor o admin)
app.post('/api/activities', async (req, res) => {
  const { nombre, descripcion, categoria, fecha, hora, lugar, cupos, creado_por } = req.body;
  if (!nombre || !descripcion || !categoria || !fecha || !hora || !lugar || !cupos || !creado_por) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  const categoriasValidas = ['formacion', 'recreacion', 'voluntariado', 'preuniversitario'];
  if (!categoriasValidas.includes(categoria)) {
    return res.status(400).json({ error: 'Categoría no válida.' });
  }
  try {
    await pool.request()
      .input('nombre',      sql.VarChar(120), nombre)
      .input('descripcion', sql.Text,         descripcion)
      .input('categoria',   sql.VarChar(20),  categoria)
      .input('fecha',       sql.Date,         fecha)
      .input('hora',        sql.Time,         hora)
      .input('lugar',       sql.VarChar(160), lugar)
      .input('cupos',       sql.SmallInt,     Number(cupos))
      .input('creado_por',  sql.BigInt,       creado_por)
      .query(`
        INSERT INTO actividades (nombre, descripcion, categoria, fecha, hora, lugar, cupos, creado_por)
        VALUES (@nombre, @descripcion, @categoria, @fecha, @hora, @lugar, @cupos, @creado_por);
      `);
    res.status(201).json({ status: 'success', message: 'Actividad creada correctamente.' });
  } catch (error) {
    handleSqlError(res, error, 'POST /api/activities');
  }
});

// DELETE /api/activities/:id — Despublicar actividad (eliminación lógica)
app.delete('/api/activities/:id', async (req, res) => {
  try {
    await pool.request()
      .input('id', sql.BigInt, req.params.id)
      .query('UPDATE actividades SET publicada = 0 WHERE id = @id;');
    res.json({ status: 'success', message: 'Actividad despublicada correctamente.' });
  } catch (error) {
    handleSqlError(res, error, 'DELETE /api/activities/:id');
  }
});

// ══════════════════════════════════════════════
// MÓDULO: INSCRIPCIONES
// ══════════════════════════════════════════════

// POST /api/registrations — Inscribirse en una actividad (con transacción para evitar sobreventa)
app.post('/api/registrations', async (req, res) => {
  const { actividad_id, usuario_id, nombre, correo, telefono } = req.body;
  if (!actividad_id || !nombre || !correo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  // actividad_id puede venir como número (SQL) o como texto ("act-excel" del frontend)
  // Si es texto, busca la actividad por nombre aproximado en la base de datos
  const esNumerico = /^\d+$/.test(String(actividad_id));

  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    let actResult;
    if (esNumerico) {
      // ID numérico directo de SQL Server
      actResult = await request
        .input('actividad_id', sql.BigInt, Number(actividad_id))
        .query('SELECT id, cupos FROM actividades WITH (UPDLOCK, HOLDLOCK) WHERE id = @actividad_id AND publicada = 1;');
    } else {
      // ID de texto del frontend (ej: "act-excel") — busca por nombre en la tabla
      // Mapeamos los IDs de demostración a nombres de actividades
      const mapaFrontend = {
        'act-excel':    'Taller Excel Básico',
        'act-basket':   'Encuentro de Básquetbol Juvenil',
        'act-limpieza': 'Jornada de Limpieza Comunitaria',
        'act-lectora':  'Preuniversitario Competencia Lectora',
        'act-m1':       'Preuniversitario Matemática M1',
        'act-arte':     'Taller de Pintura y Expresión',
        'act-cv':       'Currículum y Entrevista Laboral',
        'act-apoyo':    'Voluntariado de Apoyo Escolar'
      };
      const nombreActividad = mapaFrontend[actividad_id] || null;
      if (!nombreActividad) {
        await transaction.rollback();
        return res.status(404).json({ error: `Actividad no reconocida: ${actividad_id}` });
      }
      actResult = await request
        .input('nombre_act', sql.VarChar(120), nombreActividad)
        .query('SELECT id, cupos FROM actividades WITH (UPDLOCK, HOLDLOCK) WHERE nombre = @nombre_act AND publicada = 1;');
    }

    if (actResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'La actividad no existe o no está publicada en SQL Server.' });
    }

    // Usar el ID real de SQL Server para todas las operaciones siguientes
    const idSql        = actResult.recordset[0].id;
    const cuposTotales = actResult.recordset[0].cupos;

    // Contar inscritos confirmados
    const inscResult = await request
      .input('id_sql', sql.BigInt, idSql)
      .query("SELECT COUNT(*) AS total FROM inscripciones WHERE actividad_id = @id_sql AND estado = 'confirmada';");
    const actualesInscritos = inscResult.recordset[0].total;

    const estadoInscripcion = actualesInscritos >= cuposTotales ? 'lista_espera' : 'confirmada';

    await request
      .input('usuario_id', sql.BigInt,      usuario_id && /^\d+$/.test(String(usuario_id)) ? Number(usuario_id) : null)
      .input('nombre',     sql.VarChar(120), nombre)
      .input('correo',     sql.VarChar(120), correo.toLowerCase().trim())
      .input('telefono',   sql.VarChar(25),  telefono || null)
      .input('estado',     sql.VarChar(20),  estadoInscripcion)
      .query(`
        INSERT INTO inscripciones (actividad_id, usuario_id, nombre, correo, telefono, estado)
        VALUES (@id_sql, @usuario_id, @nombre, @correo, @telefono, @estado);
      `);

    await transaction.commit();
    res.status(201).json({
      status: 'success',
      message: estadoInscripcion === 'confirmada'
        ? 'Inscripción confirmada.'
        : 'Cupos agotados. Quedaste en lista de espera.',
      estado: estadoInscripcion
    });
  } catch (error) {
    if (transaction._began) await transaction.rollback();
    handleSqlError(res, error, 'POST /api/registrations');
  }
});

// GET /api/activities/:id/registrations — Ver inscritos de una actividad (administrador)
app.get('/api/activities/:id/registrations', async (req, res) => {
  try {
    const result = await pool.request()
      .input('actividad_id', sql.BigInt, req.params.id)
      .query(`
        SELECT id, nombre, correo, telefono, estado,
               CONVERT(varchar(19), fecha_inscripcion, 120) AS fecha_inscripcion
        FROM inscripciones
        WHERE actividad_id = @actividad_id
        ORDER BY fecha_inscripcion ASC;
      `);
    res.json(result.recordset);
  } catch (error) {
    handleSqlError(res, error, 'GET /api/activities/:id/registrations');
  }
});

// ══════════════════════════════════════════════
// MÓDULO: USUARIOS
// ══════════════════════════════════════════════

// GET /api/users — Lista de usuarios (solo administrador)
app.get('/api/users', async (_req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT u.id, u.nombre, u.apellido, u.correo, u.telefono,
             u.activo, r.nombre AS rol,
             CONVERT(varchar(19), u.fecha_creacion, 120) AS fecha_creacion
      FROM usuarios u
      INNER JOIN roles r ON u.rol_id = r.id
      ORDER BY u.fecha_creacion DESC;
    `);
    res.json(result.recordset);
  } catch (error) {
    handleSqlError(res, error, 'GET /api/users');
  }
});

// POST /api/users — Registrar un nuevo usuario
app.post('/api/users', async (req, res) => {
  const { nombre, apellido, correo, password_hash, telefono, fecha_nacimiento } = req.body;
  if (!nombre || !apellido || !correo || !password_hash) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  try {
    // Rol predeterminado: Visitante (id = 3 según datos iniciales del schema)
    await pool.request()
      .input('nombre',           sql.VarChar(60),  nombre)
      .input('apellido',         sql.VarChar(60),  apellido)
      .input('correo',           sql.VarChar(120), correo.toLowerCase().trim())
      .input('password_hash',    sql.VarChar(255), password_hash)
      .input('telefono',         sql.VarChar(25),  telefono || null)
      .input('fecha_nacimiento', sql.Date,         fecha_nacimiento || null)
      .query(`
        INSERT INTO usuarios (nombre, apellido, correo, password_hash, telefono, fecha_nacimiento, rol_id)
        VALUES (@nombre, @apellido, @correo, @password_hash, @telefono, @fecha_nacimiento, 3);
      `);
    res.status(201).json({ status: 'success', message: 'Usuario registrado correctamente.' });
  } catch (error) {
    handleSqlError(res, error, 'POST /api/users');
  }
});

// PATCH /api/users/:id/role — Cambiar rol de un usuario (solo administrador)
app.patch('/api/users/:id/role', async (req, res) => {
  const { rol_id } = req.body;
  if (!rol_id) return res.status(400).json({ error: 'Falta el campo rol_id.' });
  try {
    await pool.request()
      .input('id',     sql.BigInt,         req.params.id)
      .input('rol_id', sql.TinyInt, Number(rol_id))
      .query('UPDATE usuarios SET rol_id = @rol_id WHERE id = @id;');
    res.json({ status: 'success', message: 'Rol actualizado correctamente.' });
  } catch (error) {
    handleSqlError(res, error, 'PATCH /api/users/:id/role');
  }
});

// ══════════════════════════════════════════════
// MÓDULO: NOTICIAS
// ══════════════════════════════════════════════

// GET /api/news — Noticias publicadas
app.get('/api/news', async (_req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT n.id, n.titulo, n.contenido,
             CONVERT(varchar(10), n.fecha_publicacion, 120) AS fecha_publicacion,
             u.nombre + ' ' + u.apellido AS autor
      FROM noticias n
      INNER JOIN usuarios u ON n.autor_id = u.id
      WHERE n.publicada = 1
      ORDER BY n.fecha_publicacion DESC;
    `);
    res.json(result.recordset);
  } catch (error) {
    handleSqlError(res, error, 'GET /api/news');
  }
});

// POST /api/news — Publicar noticia (editor o admin)
app.post('/api/news', async (req, res) => {
  const { titulo, contenido, fecha_publicacion, autor_id } = req.body;
  if (!titulo || !contenido || !fecha_publicacion || !autor_id) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  try {
    await pool.request()
      .input('titulo',            sql.VarChar(150), titulo)
      .input('contenido',         sql.Text,         contenido)
      .input('fecha_publicacion', sql.Date,         fecha_publicacion)
      .input('autor_id',          sql.BigInt,       autor_id)
      .query(`
        INSERT INTO noticias (titulo, contenido, fecha_publicacion, autor_id)
        VALUES (@titulo, @contenido, @fecha_publicacion, @autor_id);
      `);
    res.status(201).json({ status: 'success', message: 'Noticia publicada correctamente.' });
  } catch (error) {
    handleSqlError(res, error, 'POST /api/news');
  }
});

// DELETE /api/news/:id — Despublicar noticia
app.delete('/api/news/:id', async (req, res) => {
  try {
    await pool.request()
      .input('id', sql.BigInt, req.params.id)
      .query('UPDATE noticias SET publicada = 0 WHERE id = @id;');
    res.json({ status: 'success', message: 'Noticia despublicada correctamente.' });
  } catch (error) {
    handleSqlError(res, error, 'DELETE /api/news/:id');
  }
});

// ══════════════════════════════════════════════
// MÓDULO: GALERÍA
// ══════════════════════════════════════════════

// GET /api/gallery — Imágenes publicadas
app.get('/api/gallery', async (_req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT g.id, g.imagen_url, g.descripcion, g.categoria,
             CONVERT(varchar(19), g.fecha_creacion, 120) AS fecha_creacion
      FROM galeria g
      WHERE g.publicada = 1
      ORDER BY g.fecha_creacion DESC;
    `);
    res.json(result.recordset);
  } catch (error) {
    handleSqlError(res, error, 'GET /api/gallery');
  }
});

// POST /api/gallery — Agregar imagen a la galería
app.post('/api/gallery', async (req, res) => {
  const { imagen_url, descripcion, categoria, cargada_por } = req.body;
  if (!imagen_url || !descripcion || !categoria || !cargada_por) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  const categoriasValidas = ['voluntariado', 'educacion', 'recreacion', 'cultura'];
  if (!categoriasValidas.includes(categoria)) {
    return res.status(400).json({ error: 'Categoría de galería no válida.' });
  }
  try {
    await pool.request()
      .input('imagen_url',  sql.VarChar(500), imagen_url)
      .input('descripcion', sql.VarChar(180), descripcion)
      .input('categoria',   sql.VarChar(20),  categoria)
      .input('cargada_por', sql.BigInt,       cargada_por)
      .query(`
        INSERT INTO galeria (imagen_url, descripcion, categoria, cargada_por)
        VALUES (@imagen_url, @descripcion, @categoria, @cargada_por);
      `);
    res.status(201).json({ status: 'success', message: 'Imagen agregada a la galería.' });
  } catch (error) {
    handleSqlError(res, error, 'POST /api/gallery');
  }
});

// DELETE /api/gallery/:id — Despublicar imagen
app.delete('/api/gallery/:id', async (req, res) => {
  try {
    await pool.request()
      .input('id', sql.BigInt, req.params.id)
      .query('UPDATE galeria SET publicada = 0 WHERE id = @id;');
    res.json({ status: 'success', message: 'Imagen eliminada de la galería.' });
  } catch (error) {
    handleSqlError(res, error, 'DELETE /api/gallery/:id');
  }
});

// ══════════════════════════════════════════════
// MÓDULO: ENCUESTAS
// ══════════════════════════════════════════════

// GET /api/surveys — Encuestas activas
app.get('/api/surveys', async (_req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT id, titulo, CONVERT(varchar(19), fecha_creacion, 120) AS fecha_creacion
      FROM encuestas
      WHERE activa = 1
      ORDER BY fecha_creacion DESC;
    `);
    res.json(result.recordset);
  } catch (error) {
    handleSqlError(res, error, 'GET /api/surveys');
  }
});

// POST /api/surveys/:id/responses — Enviar respuesta a una encuesta
app.post('/api/surveys/:id/responses', async (req, res) => {
  const { usuario_id, calificacion, comentario } = req.body;
  if (!calificacion || calificacion < 1 || calificacion > 5) {
    return res.status(400).json({ error: 'La calificación debe ser un número entre 1 y 5.' });
  }
  const uidNum = usuario_id && /^\d+$/.test(String(usuario_id)) ? Number(usuario_id) : null;
  try {
    await pool.request()
      .input('encuesta_id',  sql.BigInt,      req.params.id)
      .input('usuario_id',   sql.BigInt,      uidNum)
      .input('calificacion', sql.TinyInt,     Number(calificacion))
      .input('comentario',   sql.VarChar(500), comentario || null)
      .query(`
        INSERT INTO respuestas_encuesta (encuesta_id, usuario_id, calificacion, comentario)
        VALUES (@encuesta_id, @usuario_id, @calificacion, @comentario);
      `);
    res.status(201).json({ status: 'success', message: 'Respuesta registrada. ¡Gracias por tu opinión!' });
  } catch (error) {
    handleSqlError(res, error, 'POST /api/surveys/:id/responses');
  }
});

// GET /api/surveys/:id/results — Ver resultados de una encuesta (administrador)
app.get('/api/surveys/:id/results', async (req, res) => {
  try {
    const result = await pool.request()
      .input('encuesta_id', sql.BigInt, req.params.id)
      .query(`
        SELECT
          COUNT(*)                        AS total_respuestas,
          ROUND(AVG(CAST(calificacion AS FLOAT)), 2) AS promedio,
          SUM(CASE WHEN calificacion = 5 THEN 1 ELSE 0 END) AS excelente,
          SUM(CASE WHEN calificacion = 4 THEN 1 ELSE 0 END) AS buena,
          SUM(CASE WHEN calificacion = 3 THEN 1 ELSE 0 END) AS regular,
          SUM(CASE WHEN calificacion = 2 THEN 1 ELSE 0 END) AS deficiente,
          SUM(CASE WHEN calificacion = 1 THEN 1 ELSE 0 END) AS muy_deficiente
        FROM respuestas_encuesta
        WHERE encuesta_id = @encuesta_id;
      `);
    res.json(result.recordset[0]);
  } catch (error) {
    handleSqlError(res, error, 'GET /api/surveys/:id/results');
  }
});

// ══════════════════════════════════════════════
// MÓDULO: SOPORTE / MENSAJES DE CONTACTO
// ══════════════════════════════════════════════

// POST /api/support — Enviar mensaje de soporte
app.post('/api/support', async (req, res) => {
  const { usuario_id, nombre, correo, motivo, mensaje } = req.body;
  if (!nombre || !correo || !motivo || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  // usuario_id puede venir como texto del frontend ("usr-admin") — se ignora si no es número
  const uidNum = usuario_id && /^\d+$/.test(String(usuario_id)) ? Number(usuario_id) : null;
  try {
    await pool.request()
      .input('usuario_id', sql.BigInt,      uidNum)
      .input('nombre',     sql.VarChar(120), nombre)
      .input('correo',     sql.VarChar(120), correo.toLowerCase().trim())
      .input('motivo',     sql.VarChar(100), motivo)
      .input('mensaje',    sql.NVarChar(sql.MAX), mensaje)
      .query(`
        INSERT INTO mensajes_soporte (usuario_id, nombre, correo, motivo, mensaje)
        VALUES (@usuario_id, @nombre, @correo, @motivo, @mensaje);
      `);
    res.status(201).json({ status: 'success', message: 'Tu consulta fue registrada. Te contactaremos a la brevedad.' });
  } catch (error) {
    handleSqlError(res, error, 'POST /api/support');
  }
});

// GET /api/support — Ver mensajes de soporte (administrador)
app.get('/api/support', async (_req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT id, nombre, correo, motivo, mensaje, estado,
             CONVERT(varchar(19), fecha_creacion, 120) AS fecha_creacion
      FROM mensajes_soporte
      ORDER BY fecha_creacion DESC;
    `);
    res.json(result.recordset);
  } catch (error) {
    handleSqlError(res, error, 'GET /api/support');
  }
});

// PATCH /api/support/:id/status — Actualizar estado de un mensaje (administrador)
app.patch('/api/support/:id/status', async (req, res) => {
  const { estado } = req.body;
  const estadosValidos = ['pendiente', 'en_revision', 'resuelto'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido. Usa: pendiente, en_revision o resuelto.' });
  }
  try {
    const fechaResolucion = estado === 'resuelto' ? new Date() : null;
    await pool.request()
      .input('id',               sql.BigInt,   req.params.id)
      .input('estado',           sql.VarChar(20), estado)
      .input('fecha_resolucion', sql.DateTime, fechaResolucion)
      .query(`
        UPDATE mensajes_soporte
        SET estado = @estado, fecha_resolucion = @fecha_resolucion
        WHERE id = @id;
      `);
    res.json({ status: 'success', message: 'Estado del mensaje actualizado.' });
  } catch (error) {
    handleSqlError(res, error, 'PATCH /api/support/:id/status');
  }
});

// ══════════════════════════════════════════════
// INICIO DEL SERVIDOR
// ══════════════════════════════════════════════
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Apoyo Joven corriendo en http://localhost:${PORT}`);
  console.log('📋 Rutas disponibles:');
  console.log('   POST /api/login');
  console.log('   GET  /api/activities');
  console.log('   POST /api/activities');
  console.log('   DEL  /api/activities/:id');
  console.log('   GET  /api/activities/:id/registrations');
  console.log('   POST /api/registrations');
  console.log('   GET  /api/users');
  console.log('   POST /api/users');
  console.log('   PAT  /api/users/:id/role');
  console.log('   GET  /api/news');
  console.log('   POST /api/news');
  console.log('   DEL  /api/news/:id');
  console.log('   GET  /api/gallery');
  console.log('   POST /api/gallery');
  console.log('   DEL  /api/gallery/:id');
  console.log('   GET  /api/surveys');
  console.log('   POST /api/surveys/:id/responses');
  console.log('   GET  /api/surveys/:id/results');
  console.log('   GET  /api/support');
  console.log('   POST /api/support');
  console.log('   PAT  /api/support/:id/status');
});
