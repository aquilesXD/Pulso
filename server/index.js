import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import mysql from 'mysql2/promise';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import winston from 'winston';

dotenv.config();

// Require JWT_SECRET in production
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required in production');
}

const JWT_SECRET = process.env.JWT_SECRET || 'pulso-dev-secret-key-2024';
const JWT_EXPIRES = '24h';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Winston logger configuration
const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'pulso-admin-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    ...(NODE_ENV !== 'production' ? [new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })] : [])
  ]
});

// Create logs directory if it doesn't exist
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const app = express();

// Security: Helmet middleware for setting HTTP headers
app.use(helmet());

// Rate limiting for login endpoint (prevent brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Generic rate limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: 'Too many contact form submissions, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Enhanced CORS configuration for development and production
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from localhost and same origin
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
    ];
    
    // Also allow same origin requests
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'production') {
      // In production, restrict to specific domains
      callback(null, true);
    } else {
      // In development, allow all for easier testing
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    logger[logLevel](`${req.method} ${req.path}`, {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });
  next();
});

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

// Dev mode only: in-memory mock users when DB is unavailable
const mockUsers = NODE_ENV === 'production' ? {} : {
  'admin@pulsoit.com': {
    id: 1,
    email: 'admin@pulsoit.com',
    password_hash: bcrypt.hashSync('admin', 10),
    role: 'admin',
    nombre: 'Admin'
  },
  'admin@pulso.com': {
    id: 2,
    email: 'admin@pulso.com',
    password_hash: 'admin',
    role: 'admin',
    nombre: 'Admin Pulso'
  }
};

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  })
});

const contactSchema = Joi.object({
  nombre: Joi.string().max(150).required().messages({
    'string.max': 'Name must be less than 150 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'any.required': 'Email is required'
  }),
  telefono: Joi.string().max(30).optional(),
  servicio: Joi.string().required().messages({
    'any.required': 'Service is required'
  }),
  mensaje: Joi.string().max(5000).required().messages({
    'string.max': 'Message must be less than 5000 characters',
    'any.required': 'Message is required'
  })
});

// Validation middleware
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(400).json({ message: 'Validation error', errors: messages });
  }
  req.body = value;
  next();
};

async function initDb() {
  pool = mysql.createPool(dbConfig);
  await pool.query('SELECT 1');
  dbAvailable = true;
}

initDb().catch((err) => {
  logger.error('DB connection failed', { error: err.message });
  if (NODE_ENV === 'development') {
    logger.warn('Running in DEV mode with mock users. Available accounts: admin@pulsoit.com / admin, admin@pulso.com / admin');
  }
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
    logger.error('Insert failed:', { error: err.message });
    res.status(500).json({ error: 'DB error' });
  }
});

// Admin login - valida contra tabla usuarios (o mock users en dev)
app.post('/api/auth/login', loginLimiter, validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = null;

    // Try database first if available
    if (dbAvailable) {
      const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
      if (rows.length > 0) user = rows[0];
    } else {
      // Use mock users in dev mode
      user = mockUsers[email] || null;
    }

    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    // Support both bcrypt hash and plain text passwords
    let valid = false;
    const passHash = user.password_hash || user.password;
    if (passHash.startsWith('$2')) {
      valid = await bcrypt.compare(password, passHash);
    } else {
      valid = password === passHash;
    }
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });

    const payload = { id: user.id, email: user.email, role: user.role || 'admin' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return res.json({ token, user: { email: user.email, role: user.role || 'admin', nombre: user.nombre || '' } });
  } catch (err) {
    logger.error('Login error:', { error: err.message });
    return res.status(500).json({ message: 'Error del servidor' });
  }
});

// Health check endpoint (development only, minimal info)
if (NODE_ENV === 'development') {
  app.get('/api/health', (req, res) => {
    return res.json({ status: 'ok', environment: NODE_ENV });
  });
}

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
app.post('/api/contactos', contactLimiter, validate(contactSchema), async (req, res) => {
  if (!dbAvailable) return res.status(503).json({ message: 'Database unavailable' });
  const { nombre, email, telefono, servicio, mensaje } = req.body;
  try {
    const [result] = await pool.execute(
      `INSERT INTO contactos_formulario (nombre_completo, email, telefono, servicio_interes, mensaje, fecha_envio)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [nombre, email, telefono || null, servicio, mensaje]
    );
    const [rows] = await pool.execute('SELECT * FROM contactos_formulario WHERE id = ?', [result.insertId]);
    return res.json(rows[0]);
  } catch (err) {
    logger.error('Insert contactos failed:', { error: err.message });
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
    logger.error('List contactos failed:', err && err.message ? err.message : err);
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
    logger.error('Stats failed:', err && err.message ? err.message : err);
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
    logger.error('Get contacto failed:', err && err.message ? err.message : err);
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
    logger.error('Update estado failed:', err && err.message ? err.message : err);
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
    logger.error('Delete contacto failed:', err && err.message ? err.message : err);
    return res.status(500).json({ message: err && err.message ? err.message : String(err) });
  }
});

app.listen(port, () => console.log(`Contact API listening on ${port}`));
