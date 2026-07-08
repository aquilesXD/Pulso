import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import mysql from 'mysql2/promise';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(port, () => console.log(`Contact API listening on ${port}`));
