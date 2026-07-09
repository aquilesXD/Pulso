# Checklist de Producción - Pulso Admin

## Estado Actual: ⚠️ NO LISTO PARA PRODUCCIÓN

### Crítico - DEBE HACERSE

- [ ] **Seguridad - JWT_SECRET**
  - ❌ Actualmente usa `'pulso-dev-secret-key-2024'` como default
  - ✅ Necesita: Generar un JWT_SECRET seguro para producción
  - ```bash
    openssl rand -base64 32
    ```
  - Agregar `JWT_SECRET` a variables de entorno de producción

- [ ] **Base de Datos - Validación de Contraseñas**
  - ❌ Las contraseñas en BD deben estar hasheadas con bcrypt
  - ✅ Crear script SQL para hashear contraseñas existentes:
    ```sql
    -- Insertar admin con contraseña hasheada
    INSERT INTO usuarios (email, password, role) 
    VALUES ('admin@pulso.com', '$2b$10$...', 'admin');
    ```

- [ ] **Endpoint /api/_status - DEBE REMOVERSE**
  - ❌ Expone información sensible (mock users, modo actual)
  - ✅ Remover en producción
  - ✅ Crear un endpoint separado `/api/health` sin información sensible

- [ ] **Mock Users - DEBEN REMOVERSE**
  - ❌ Las cuentas mock `admin@pulsoit.com` y `admin@pulso.com` no deberían existir en producción
  - ✅ Remover objeto `mockUsers` cuando `dbAvailable` es true
  - ✅ Forzar error si BD no está disponible en producción

- [ ] **CORS - Restringir Origins**
  - ⚠️ Actualmente acepta todas las origins en desarrollo
  - ✅ En producción: Especificar solo tu dominio
  - ```javascript
    origin: process.env.ALLOWED_ORIGINS?.split(',') || []
    ```

- [ ] **Variables de Entorno Requeridas**
  - [ ] `JWT_SECRET` - Secreto para firmar tokens JWT
  - [ ] `DB_HOST` - Host de MySQL
  - [ ] `DB_PORT` - Puerto de MySQL (default: 3306)
  - [ ] `DB_USER` - Usuario de MySQL
  - [ ] `DB_PASS` - Contraseña de MySQL
  - [ ] `DB_NAME` - Nombre de BD (pulso)
  - [ ] `NODE_ENV` - Debe ser "production"
  - [ ] `PORT` - Puerto del servidor (default: 4000)
  - [ ] `ALLOWED_ORIGINS` - Origins permitidos (e.g., https://midominio.com)

### Importante - ALTAMENTE RECOMENDADO

- [ ] **Validación de Inputs**
  - ⚠️ Agregar validación más robusta en todos los endpoints
  - Usar librería como `joi` o `zod` para validar datos

- [ ] **Rate Limiting**
  - ⚠️ Sin protección contra ataques de fuerza bruta en login
  - Implementar rate limiting en `/api/auth/login`

- [ ] **Logs y Monitoreo**
  - ⚠️ Los logs van a console, no se persisten
  - Implementar logging con Winston o Morgan
  - Agregar monitoreo de errores (Sentry, LogRocket)

- [ ] **HTTPS**
  - ⚠️ No está configurado SSL/TLS
  - Usar certificado SSL en producción
  - Forzar redirección HTTP → HTTPS

- [ ] **Headers de Seguridad**
  - Agregar middleware `helmet` para headers seguros
  - ```bash
    npm install helmet
    ```

- [ ] **Testing**
  - [ ] Tests unitarios para endpoints críticos
  - [ ] Tests de integración para flujo de login
  - [ ] Tests de BD

- [ ] **Build y Deployment**
  - [ ] Vite build optimizado para frontend
  - [ ] Environment-specific configurations
  - [ ] CI/CD pipeline (GitHub Actions, etc.)

- [ ] **Base de Datos**
  - [ ] Backup automático
  - [ ] Migración de datos verificada
  - [ ] Índices en columnas frecuentemente consultadas (email, fecha_envio)

### Recomendaciones Menores

- [ ] Agregar endpoint para cambiar contraseña de admin
- [ ] Agregar endpoint para listar usuarios (admin)
- [ ] Agregar paginación en contactos (ya existe pero mejorar)
- [ ] Agregar filtros más avanzados en contactos
- [ ] Documentación de API completa (Swagger/OpenAPI)
- [ ] Endpoint para exportar contactos a CSV
- [ ] Implementar soft deletes en contactos (en lugar de delete hard)

## Pasos para Pasar a Producción

### 1. Antes de Deploy
```bash
# Generar JWT_SECRET
openssl rand -base64 32

# Instalar dependencias de seguridad
npm install helmet express-rate-limit joi

# Ejecutar tests
npm test

# Build frontend
npm run build

# Verificar variables de entorno
cat .env.production
```

### 2. Configurar Variables de Entorno en Hosting
```
NODE_ENV=production
JWT_SECRET=<generated-secret>
DB_HOST=<your-mysql-host>
DB_PORT=3306
DB_USER=<db-user>
DB_PASS=<db-password>
DB_NAME=pulso
ALLOWED_ORIGINS=https://tudominio.com
PORT=4000
```

### 3. Remover Código de Desarrollo
- Remover mock users
- Remover endpoint `/api/_status`
- Remover console.log de debug
- Remover servidor de desarrollo de Vite

### 4. Deploy
```bash
npm ci --production
npm run build
npm start
```

### 5. Post-Deploy
- [ ] Verificar que login funciona en producción
- [ ] Verificar que BD está conectada
- [ ] Verificar que CORS funciona correctamente
- [ ] Monitoring y alertas activas
- [ ] Backups configurados

## Comandos Útiles para Producción

```bash
# Generar JWT_SECRET
openssl rand -base64 32

# Verificar que puerto está en uso
lsof -i :4000

# Reiniciar servidor
systemctl restart pulso-server

# Ver logs
tail -f /var/log/pulso.log

# Backup de BD
mysqldump -h <host> -u <user> -p pulso > pulso_backup_$(date +%Y%m%d).sql
```

## Tabla de Progreso

| Item | Estado | Notas |
|------|--------|-------|
| Autenticación Básica | ✅ Completo | Funcionando con mock users |
| JWT Tokens | ✅ Completo | Necesita JWT_SECRET seguro |
| Endpoints CRUD | ✅ Completo | Contactos funcional |
| BD Configuration | ✅ Completo | Necesita conexión real |
| CORS | ✅ Parcial | Necesita restricción de origins |
| Seguridad | ⚠️ Parcial | Faltan varios elementos |
| Testing | ❌ No existe | Necesario antes de prod |
| Monitoreo | ❌ No existe | Necesario en producción |
| Deployment | ⚠️ Pendiente | Infraestructura no configurada |
