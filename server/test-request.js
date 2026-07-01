// Simple test script to POST to the local API
(async function(){
  try {
    const res = await fetch('http://127.0.0.1:4000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Prueba',
        email: 'test@example.com',
        phone: '+584120000000',
        service: 'Soporte',
        message: 'Mensaje de prueba desde test-request'
      })
    });
    const data = await res.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
