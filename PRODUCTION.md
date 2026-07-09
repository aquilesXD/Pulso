# Guía de Producción - Panel de Administración Pulso

## Checklist Pre-Deploy

### Variables de Entorno Requeridas

Asegúrate de establecer estas variables en tu servidor de producción:

```bash
# Seguridad
JWT_SECRET=<generar con: openssl rand -base64 32>
NODE_ENV=production

# Base de Datos
DB_HOST=<tu-host-mysql>
DB_PORT=3306
DB_USER=<tu-usuario-mysql>
DB_PASS=<tu-contraseña-mysql>
DB_NAME=pulso

# API Frontend
VITE_ADMIN_API_URL=https://tu-dominio.com/api
```

### Verificación de Seguridad

- [ ] JWT_SECRET es único y generado con `openssl rand -base64 32`
- [ ] NODE_ENV está configurado como "production"
- [ ] Base de datos MySQL está accesible y configurada
- [ ] SSL/HTTPS está habilitado en el servidor
- [ ] Firewall permite solo puertos 80 (HTTP) y 443 (HTTPS)
- [ ] Headers de seguridad están activos (Helmet)
- [ ] Rate limiting está habilitado en /api/auth/login
- [ ] Validación de inputs está activa
- [ ] CORS está restringido a dominios autorizados
- [ ] Logs se guardan en /logs (revisar regularmente)

## Seguridad Implementada

### 1. Autenticación y Autorización
- **JWT con SECRET seguro**: Requiere JWT_SECRET en variables de entorno
- **Tokens con expiración**: Los tokens expiran en 24 horas
- **Middleware de autenticación**: Protege endpoints administrativos
- **Roles de usuario**: Soporte para diferentes roles (admin)

### 2. Validación de Inputs
- **Joi Schemas**: Validación robusta de email, password, contacto
- **Sanitización**: Parámetros se validan antes de procesar
- **Mensajes de error**: No exponen detalles de BD

### 3. Rate Limiting
- **Login**: Máximo 5 intentos cada 15 minutos
- **Contacto**: Máximo 10 envíos cada hora
- **Previene**: Ataques de fuerza bruta y spam

### 4. Headers de Seguridad (Helmet)
- **X-Frame-Options**: Previene clickjacking
- **X-Content-Type-Options**: Previene MIME sniffing
- **Strict-Transport-Security**: Fuerza HTTPS
- **CSP**: Content Security Policy para prevenir XSS

### 5. CORS Configurado
- **Desarrollo**: Acepta localhost:5173 y localhost:5174
- **Producción**: Restringido a dominios específicos (modificar en server/index.js)
- **Credenciales**: Habilitadas para cookies/auth

### 6. Logging Profesional
- **Winston Logger**: Registra todos los errores en `/logs`
- **Archivos separados**: error.log y combined.log
- **Rotación**: Considera agregar winston-daily-rotate-file
- **Monitoreo**: Configura alertas en archivos de error

### 7. Sin Información Sensible
- **Removido**: Endpoint /api/_status que exponía información
- **Removidos**: Mock users en producción (solo en desarrollo)
- **Validación**: Los errores no exponen estructura de BD

## Variables de Entorno en Producción

### Cambios vs Desarrollo

```javascript
// DESARROLLO (.env.development.local)
NODE_ENV=development
JWT_SECRET=pulso-dev-secret-key-2024
DB_HOST=127.0.0.1

// PRODUCCIÓN (variables del servidor)
NODE_ENV=production
JWT_SECRET=<secreto-generado-seguro>
DB_HOST=<servidor-mysql-remoto>
```

### Mock Users
- **En desarrollo**: Disponibles `admin@pulsoit.com` / `admin` y `admin@pulso.com` / `admin`
- **En producción**: NO disponibles (requiere BD real)

## Deployment en Vercel

### 1. Configurar Variables de Entorno

```bash
vercel env add JWT_SECRET
vercel env add DB_HOST
vercel env add DB_USER
vercel env add DB_PASS
vercel env add NODE_ENV production
```

### 2. Build for Production

```bash
npm run build
```

### 3. Verificar que BD esté disponible

```bash
npm start
curl https://tu-proyecto.vercel.app/api/contactos
# Debe retornar error 401 (sin token JWT), no error de conexión
```

### 4. Monitoreo Post-Deploy

- [ ] Revisar archivos de log en `/logs`
- [ ] Probar login con credenciales reales
- [ ] Verificar CORS en navegador (DevTools -> Network)
- [ ] Confirmar SSL certificate válido
- [ ] Testear rate limiting (5 logins fallidos)

## SSL/HTTPS

### Para Vercel
Vercel maneja SSL automáticamente. Verifica:
- [ ] El certificado esté vigente
- [ ] Redirección HTTP -> HTTPS funcione

### Para servidor propio
```bash
# Usando Let's Encrypt (certbot)
sudo certbot certonly --standalone -d tu-dominio.com
sudo certbot renew --dry-run  # Verificar renovación automática

# Configurar en Node.js o Nginx proxy
```

## CORS en Producción

Actualizar en `server/index.js` línea ~89:

```javascript
const allowedOrigins = [
  'https://tu-dominio.com',
  'https://www.tu-dominio.com',
  'https://admin.tu-dominio.com'
];
```

## Monitoreo y Mantenimiento

### Logs
```bash
# Ver últimos errores
tail -f logs/error.log

# Limpiar logs antiguos (mensual)
find logs -mtime +30 -delete
```

### Backups de BD
```bash
# Backup diario a las 2 AM
0 2 * * * mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME | gzip > ~/backups/pulso-$(date +%Y%m%d).sql.gz
```

### Renovar JWT_SECRET (opcional)
Si sospechas compromiso del secret:
1. Generar nuevo: `openssl rand -base64 32`
2. Usuarios activos deberán volver a loguearse
3. Todos los tokens viejos se invalidarán

## Troubleshooting

### "JWT_SECRET environment variable is required in production"
- Verifica que JWT_SECRET esté configurado como variable de entorno
- En Vercel: Settings -> Environment Variables

### "Database unavailable"
- Verificar credenciales de MySQL
- Confirmar que IP del servidor está en whitelist de BD
- Probar conexión: `mysql -h $DB_HOST -u $DB_USER -p`

### "Too many login attempts"
- Rate limiting funcionando correctamente
- Esperar 15 minutos o limpiar en DB: `FLUSH PRIVILEGES;`

### Archivos de log muy grandes
- Implementar rotación diaria: `npm install winston-daily-rotate-file`
- Configurar limpieza automática

## Recursos Adicionales

- [OWASP Security Best Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Última actualización**: 2024
**Responsable**: Equipo de Infraestructura Pulso
