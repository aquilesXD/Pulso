import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'pulso',
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@pulsoit.com';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin';

(async function main(){
  try{
    const conn = await mysql.createConnection(dbConfig);
    console.log('Connected to DB', dbConfig.database);

    // Create table if not exists
    const createSql = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(200) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await conn.execute(createSql);
    console.log('Ensured table usuarios exists');

    // Hash password with bcrypt if available
    let hash = ADMIN_PASS;
    try{
      const bcrypt = await import('bcryptjs');
      hash = bcrypt.hashSync(ADMIN_PASS, 10);
      console.log('Password hashed with bcrypt');
    }catch(e){
      console.warn('bcryptjs not available, storing password plaintext (not recommended)');
    }

    // Insert admin if not exists
    const [rows] = await conn.execute('SELECT id FROM usuarios WHERE email = ?', [ADMIN_EMAIL]);
    if (rows && rows.length > 0) {
      console.log('Admin already exists, skipping insert');
    } else {
      await conn.execute('INSERT INTO usuarios (email, password_hash, role) VALUES (?, ?, ?)', [ADMIN_EMAIL, hash, 'admin']);
      console.log('Admin user created:', ADMIN_EMAIL);
    }

    await conn.end();
  }catch(err){
    console.error('Migration failed:', err.message || err);
    process.exit(1);
  }
})();
