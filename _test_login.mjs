const res = await fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@pulso.com', password: 'admin' })
});
const data = await res.json();
console.log('RESULT:', JSON.stringify(data, null, 2));