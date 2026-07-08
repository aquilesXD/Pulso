import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import mysql from 'mysql2/promise';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'pulso-dev-secret-key-2024';
const JWT_EXPIRES = '24h';

const app = express();
app.use(cors());
app.use(express.json());

// Dev: log incoming requests
// (no request logging in production)

// Serve production build (dist) as static files and fallback to index.html for SPA routes
const distPath = path.resolve(process.cwd(), 'dist');
const hasDist = fs.existsSync(distPath);
if (hasDist) {
  app.use(express.static(distPath));
  app.use('/pulso/assets', express.static(path.join(distPath, 'assets')));
  app.use('/pulso', express.static(distPath));
} else {
  console.warn('Warning: dist directory not found. Run npm run build before starting the server.');
}

// Redirect only the base /pulso route to root so SPA router sees '/'
app.get(/^\/pulso\/?$/, (req, res) => {
  return res.redirect('/');
});

// SPA fallback: serve index.html for non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  if (!hasDist) {
    return res.status(404).send('Build files not found. Run npm run build and restart the server.');
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 4000;

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'pulso',
  waitForConnections: true,
  connectionLimit: 10,
};

let pool;
let dbAvailable = false;
async function initDb() {
  pool = mysql.createPool(dbConfig);
  await pool.query('SELECT 1');
  dbAvailable = true;
}

initDb().catch((err) => {
  console.error('DB connection failed:', err);
  dbAvailable = false;
});

app.post('/api/contact', async (req, res) => {
  if (!dbAvailable) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const { name, email, phone, service, message } = req.body || {};
  if (!name || !email || !service || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO contactos_formulario (nombre_completo, email, telefono, servicio_interes, mensaje, fecha_envio) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, email, phone || null, service, message]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error('Insert failed:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Admin login - valida contra tabla usuarios
app.post('/api/auth/login', async (req, res) => {
  if (!dbAvailable) return res.status(503).json({ message: 'Database unavailable' });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email y password requeridos' });

  try {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Credenciales inválidas' });

    const user = rows[0];
    // Support both bcrypt hash and plain text passwords
    let valid = false;
    if (user.password.startsWith('$2')) {
      valid = await bcrypt.compare(password, user.password);
    } else {
      valid = password === user.password;
    }
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });

    const payload = { id: user.id, email: user.email, role: user.role || 'admin' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return res.json({ token, user: { email: user.email, role: user.role || 'admin', nombre: user.nombre || '' } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});

// Dev: status endpoint
app.get('/api/_status', (req, res) => {
  return res.json({ dbAvailable, adminEnv: { ADMIN_EMAIL: process.env.ADMIN_EMAIL || null } });
});

// Admin auth middleware - valida JWT
function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

// Public: create contacto from landing (usa nombres reales de columna)
app.post('/api/contactos', async (req, res) => {
  if (!dbAvailable) return res.status(503).json({ message: 'Database unavailable' });
  const { nombre, email, telefono, servicio, mensaje } = req.body || {};
  if (!nombre || !email || !servicio || !mensaje) return res.status(400).json({ message: 'Missing fields' });
  try {
    const [result] = await pool.execute(
      `INSERT INTO contactos_formulario (nombre_completo, email, telefono, servicio_interes, mensaje, fecha_envio)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [nombre, email, telefono || null, servicio, mensaje]
    );
    const [rows] = await pool.execute('SELECT * FROM contactos_formulario WHERE id = ?', [result.insertId]);
    return res.json(rows[0]);
  } catch (err) {
    console.error('Insert contactos failed:', err);
    return res.status(500).json({ message: 'DB error' });
  }
});

// Admin: list contactos with filters (usa nombres reales de columna)
app.get('/api/contactos', adminAuth, async (req, res) => {
  if (!dbAvailable) return res.status(503).json({ message: 'Database unavailable' });
  const search = req.query.search || '';
  const estado = req.query.estado || 'all';
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const limit = Math.max(1, parseInt(req.query.limit || '20', 10));
  const offset = (page - 1) * limit;

  try {
    const where = [];
    const params = [];
    if (search) { where.push('(nombre_completo LIKE ? OR email LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    if (estado && estado !== 'all') { where.push('estado = ?'); params.push(estado); }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [rows] = await pool.execute(
      `SELECT id, nombre_completo as nombre, email, telefono, servicio_interes as servicio, mensaje, estado, fecha_envio as created_at FROM contactos_formulario ${whereSql} ORDER BY fecha_envio DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [countRows] = await pool.execute(`SELECT COUNT(*) as total FROM contactos_formulario ${whereSql}`, params);
    const total = countRows[0]?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.json({ data: rows, total, totalPages, page });
  } catch (err) {
    console.error('List contactos failed:', err && err.message ? err.message : err);
    return res.status(500).json({ message: err && err.message ? err.message : String(err) });
  }
});

// Admin: stats (incluye conteo por estado) — DEBE IR ANTES de /:id
app.get('/api/contactos/stats', adminAuth, async (req, res) => {
  if (!dbAvailable) return res.status(503).json({ message: 'Database unavailable' });
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM contactos_formulario');
    const [estadoRows] = await pool.execute(
      "SELECT estado, COUNT(*) as count FROM contactos_formulario GROUP BY estado"
    );
    const stats = { total: rows[0].total, new: 0, contacted: 0, resolved: 0 };
    for (const r of estadoRows) {
      stats[r.estado] = r.count;
    }
    return res.json(stats);
  } catch (err) {
    console.error('Stats failed:', err && err.message ? err.message : err);
    return res.status(500).json({ message: err && err.message ? err.message : String(err) });
  }
});

// Admin: get contacto (usa nombres reales)
app.get('/api/contactos/:id', adminAuth, async (req, res) => {
  if (!dbAvailable) return res.status(503).json({ message: 'Database unavailable' });
  const id = req.params.id;
  try {
    const [rows] = await pool.execute('SELECT id, nombre_completo as nombre, email, telefono, servicio_interes as servicio, mensaje, estado, fecha_envio as created_at FROM contactos_formulario WHERE id = ?', [id]);
    if (!rows[0]) return res.status(404).json({ message: 'Not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('Get contacto failed:', err && err.message ? err.message : err);
    return res.status(500).json({ message: err && err.message ? err.message : String(err) });
  }
});

// Admin: update estado
app.patch('/api/contactos/:id', adminAuth, async (req, res) => {
  if (!dbAvailable) return res.status(503).json({ message: 'Database unavailable' });
  const id = req.params.id;
  const { estado } = req.body || {};
  if (!estado || !['new', 'contacted', 'resolved'].includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido. Use: new, contacted, resolved' });
  }
  try {
    await pool.execute('UPDATE contactos_formulario SET estado = ? WHERE id = ?', [estado, id]);
    const [rows] = await pool.execute('SELECT id, nombre_completo as nombre, email, telefono, servicio_interes as servicio, mensaje, estado, fecha_envio as created_at FROM contactos_formulario WHERE id = ?', [id]);
    if (!rows[0]) return res.status(404).json({ message: 'Not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('Update estado failed:', err && err.message ? err.message : err);
    return res.status(500).json({ message: err && err.message ? err.message : String(err) });
  }
});

// Admin: delete contacto
app.delete('/api/contactos/:id', adminAuth, async (req, res) => {
  if (!dbAvailable) return res.status(503).json({ message: 'Database unavailable' });
  const id = req.params.id;
  try {
    await pool.execute('DELETE FROM contactos_formulario WHERE id = ?', [id]);
    return res.status(204).send();
  } catch (err) {
    console.error('Delete contacto failed:', err && err.message ? err.message : err);
    return res.status(500).json({ message: err && err.message ? err.message : String(err) });
  }
});

app.listen(port, () => console.log(`Contact API listening on ${port}`));
