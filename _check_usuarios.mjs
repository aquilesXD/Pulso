import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'pulso'
});

const [r] = await conn.execute("SHOW TABLES LIKE 'usuarios'");
console.log('Tabla usuarios existe:', r.length > 0);

if (r.length > 0) {
  const [rows] = await conn.execute("SELECT * FROM usuarios");
  console.log('Usuarios:', JSON.stringify(rows, null, 2));
  
  const [cols] = await conn.execute(
    "SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
    ['pulso', 'usuarios']
  );
  console.log('Columnas:', cols.map(c => c.COLUMN_NAME).join(', '));
} else {
  console.log('La tabla usuarios NO existe. Hay que crearla.');
}

await conn.end();