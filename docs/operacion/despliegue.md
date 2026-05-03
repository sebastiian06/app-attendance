# Despliegue en Producción

## Consideraciones para producción

Este documento describe los cambios necesarios para llevar la aplicación a un entorno de producción real.

## ⚠️ Importante

Actualmente la aplicación está configurada para **desarrollo**. Antes de desplegar en producción, se deben realizar los siguientes cambios.

## Lista de verificación pre-despliegue

| Aspecto | Estado Actual | Producción |
|---------|---------------|------------|
| Contraseñas hasheadas | ❌ No | ✅ Si (bcrypt) |
| HTTPS | ❌ HTTP | ✅ HTTPS |
| JWT Secret | ⚠️ Por defecto | ✅ Generar único |
| CORS | ⚠️ Abierto | ✅ Restringido |
| Rate limiting | ❌ No | ✅ Si |
| Logs | ⚠️ Consola | ✅ Archivo/Sistema |
| Variables de entorno | ⚠️ En archivo | ✅ Secretos |

## Cambios necesarios

### 1. Base de datos

**Desarrollo:** MongoDB en contenedor local
**Producción:** MongoDB Atlas o instancia dedicada

```bash
# Conexión a MongoDB Atlas
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/app_attendance
```

### 2. Seguridad - Hash de contraseñas
#### Instalar bcrypt:

```bash
cd back
npm install bcrypt
npm install -D @types/bcrypt
```

#### Modificar modelo Person:

```typescript
// Agregar campo password
password: { type: String, required: true }
```

#### Modificar login:

```typescript
import bcrypt from 'bcrypt';

// Verificar contraseña hasheada
const isValid = await bcrypt.compare(password, user.password);
```

### 3. JWT Secret
#### Generar secreto seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
#### Configurar en .env:

```bash
JWT_SECRET=7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d
```
### 4. CORS restringido
```typescript
// back/src/index.ts

// Permitir solo dominios específicos
const allowedOrigins = [
  'https://tudominio.com',
  'https://www.tudominio.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));
```
### 5. Rate limiting

#### Instalar:

```bash
cd back
npm install express-rate-limit
```

#### Configurar:

```typescript
// back/src/index.ts
import rateLimit from 'express-rate-limit';

// Límite para registro QR (público)
const attendanceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos por IP
  message: { error: 'Demasiados intentos, espere 15 minutos' }
});

app.use('/api/public/attendance', attendanceLimiter);
```

### 6. HTTPS
#### Opción A: Let's Encrypt (recomendado)

```bash
# Instalar certbot
sudo apt install certbot

# Obtener certificado
sudo certbot certonly --standalone -d tudominio.com
```
#### Opción B: Proxy inverso con Nginx

```nginx
server {
    listen 443 ssl;
    server_name tudominio.com;

    ssl_certificate /etc/ssl/certs/tudominio.crt;
    ssl_certificate_key /etc/ssl/private/tudominio.key;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
### 7. Variables de entorno en producción
```bash
# .env.production
NODE_ENV=production
API_PORT=4000
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/app_attendance
JWT_SECRET=secreto_generado_seguro
CORS_ORIGIN=https://tudominio.com
LOG_LEVEL=info
```
### 8. Logs centralizados
```typescript
// back/src/config/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```
## Opciones de despliegue

### Opción 1: Servidor VPS (DigitalOcean, AWS EC2, Linode)
```bash
# Conectar al servidor
ssh usuario@ip-servidor

# Instalar dependencias
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clonar repositorio
git clone https://github.com/tu-usuario/app-attendance.git
cd app-attendance

# Configurar .env
cp .env.example .env
# Editar .env con variables de producción

# Levantar servicios
docker-compose up -d --build
```
### Opción 2: MongoDB Atlas + Vercel/Netlify
#### Frontend (Vercel/Netlify):

1. Conectar repositorio de GitHub

2. Configurar variable: VITE_API_URL=https://api.tudominio.com

3. Desplegar

#### Backend (Railway/Render):

1. Conectar repositorio

2. Configurar variables de entorno

3. Desplegar

### Opción 3: Contenedores orquestados (Kubernetes)
Para aplicaciones a gran escala, considerar:

- Google Kubernetes Engine (GKE)

- Amazon EKS

- DigitalOcean Kubernetes

## Script de despliegue rápido
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Iniciando despliegue..."

# Pull últimos cambios
git pull origin main

# Reconstruir imágenes
docker-compose down
docker-compose build --no-cache

# Levantar servicios
docker-compose up -d

# Ejecutar migraciones/seed (solo si es necesario)
# docker exec app_attendance_api npm run seed

echo "✅ Despliegue completado"
```
## Monitoreo (recomendado)
|Herramienta	|Propósito|
|---------------|---------|
|PM2	|Mantener Node.js corriendo|
|Grafana	|Dashboards de monitoreo|
|Prometheus	|Métricas del sistema|
|Sentry	|Errores del frontend|

## Presupuesto mensual estimado (bajo uso)
|Servicio	|Costo|
|-----------|-----|
|VPS básico	|$5-10 USD|
|MongoDB Atlas	|Gratis (512MB)|
|Dominio .com	|$12 USD/año|
|SSL	|Gratis (Let's Encrypt)|
|Total	|$5-10 USD/mes|


## Enlaces útiles
- [MongoDB Atlas](https://www.mongodb.com/es/products/platform)

- [Vercel](https://vercel.com/)

- [Railway](https://railway.com/)

- [Let's Encrypt](https://letsencrypt.org/)