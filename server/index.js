import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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
async function initDb() {
  pool = mysql.createPool(dbConfig);
  await pool.query('SELECT 1');
}

initDb().catch((err) => {
  console.error('DB connection failed:', err);
});

app.post('/api/contact', async (req, res) => {
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
