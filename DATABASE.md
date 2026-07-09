# Configuración de Base de Datos - Pulso

## Base de Datos: `pulso`

### Tablas

#### `usuarios`
```sql
CREATE TABLE `usuarios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `usuarios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
```

#### `contactos_formulario`
```sql
CREATE TABLE `contactos_formulario` (
  `id` int(11) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(30) NOT NULL,
  `servicio_interes` enum('Soporte Técnico','Desarrollo Web','Automatizaciones','Reparación y Diagnóstico','Mantenimiento Preventivo','Plan de Soporte Remoto Mensual','Asesoría Tecnológica','Desarrollo de API REST','Configuración de Red Básica','Otro') NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

ALTER TABLE `contactos_formulario`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `contactos_formulario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
```

## Configuración de Conexión

### Variables de Entorno

Configura las siguientes variables en tu archivo `.env.production.local`:

```bash
DB_HOST=tu-host-mysql.com
DB_PORT=3306
DB_USER=tu-usuario
DB_PASS=tu-contraseña
DB_NAME=pulso
```

### En Desarrollo

En desarrollo, el servidor usa:
- Variables por defecto: `localhost:3306` con usuario `root` y sin contraseña
- Base de datos: `pulso`
- Si MySQL no está disponible, usa mock users: `admin@pulsoit.com` / `admin` y `admin@pulso.com` / `admin`

### En Producción

Para producción:
1. Configura las variables de entorno con tus credenciales reales
2. Asegúrate de que la base de datos existe y tiene las tablas creadas
3. Reinicia el servidor para que cargue las nuevas variables

## Usuarios por Defecto (Modo Desarrollo)

Cuando la base de datos no está disponible, el servidor funciona en modo desarrollo con estos usuarios:

- **Email:** `admin@pulsoit.com` **Contraseña:** `admin`
- **Email:** `admin@pulso.com` **Contraseña:** `admin`

## API Endpoints

### Autenticación

- **POST** `/api/auth/login` - Inicia sesión con email y contraseña
- **POST** `/api/auth/logout` - Cierra sesión
- **GET** `/api/auth/profile` - Obtiene el perfil del usuario autenticado

### Solicitudes de Contacto

- **GET** `/api/contactos` - Lista todas las solicitudes
- **GET** `/api/contactos/:id` - Obtiene una solicitud específica
- **POST** `/api/contactos` - Crea una nueva solicitud
- **PUT** `/api/contactos/:id` - Actualiza una solicitud
- **DELETE** `/api/contactos/:id` - Elimina una solicitud

## Troubleshooting

### Error: "Database unavailable"

- **Causa:** MySQL no está conectado o las credenciales son incorrectas
- **Solución en desarrollo:** El sistema usa mock users automáticamente
- **Solución en producción:** Verifica las variables de entorno y la disponibilidad de MySQL

### Error: "Table 'pulso.usuarios' doesn't exist"

- **Causa:** Las tablas no fueron creadas en la base de datos
- **Solución:** Ejecuta los scripts SQL de creación de tablas proporcionados arriba
