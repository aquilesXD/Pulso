import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'pulso',
  });

  try {
    await c.execute(
      "ALTER TABLE contactos_formulario ADD COLUMN estado ENUM('new','contacted','resolved') NOT NULL DEFAULT 'new'"
    );
    console.log('✓ Column estado added successfully');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column estado already exists');
    } else {
      throw err;
    }
  }

  await c.end();
}

run().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});