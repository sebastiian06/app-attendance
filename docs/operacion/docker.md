# Docker Compose - Guía de uso

## Descripción

Docker Compose permite levantar todos los servicios del proyecto con un solo comando, garantizando un entorno reproducible en cualquier máquina.

## Servicios incluidos

| Servicio | Contenedor | Puerto | Descripción |
|----------|------------|--------|-------------|
| MongoDB | `app_attendance_mongo` | 27017 | Base de datos |
| Backend API | `app_attendance_api` | 4000 | API Node.js |
| Frontend | `app_attendance_frontend` | 8080 | App Ionic React |

## Requisitos

- Docker Desktop 24.x o superior
- Docker Compose 2.x o superior

## Comandos básicos

### Levantar todos los servicios

```bash
docker-compose up -d
```
El flag -d ejecuta los contenedores en segundo plano (detached mode).

### Ver estado de los contenedores
```bash
docker-compose ps
```

### Ver logs
```bash
# Todos los servicios
docker-compose logs

# Servicio específico
docker-compose logs api
docker-compose logs mongo
docker-compose logs app

# Seguir logs en tiempo real
docker-compose logs -f
```

### Detener servicios
```bash
docker-compose down
```

### Detener y eliminar volúmenes (borrar datos)
```bash
docker-compose down -v
```

### Reconstruir imágenes después de cambios
```bash
docker-compose up -d --build
```

## Flujo completo de uso
### 1. Clonar y configurar
```bash
git clone https://github.com/tu-usuario/app-attendance.git
cd app-attendance
cp .env.example .env
```
### 2. Levantar servicios
```bash
docker-compose up -d
```
### 3. Verificar que todo está corriendo
```bash
docker-compose ps
```

**Salida esperada:**

```text
NAME                      STATUS          PORTS
app_attendance_mongo      Up 2 minutes    0.0.0.0:27017->27017/tcp
app_attendance_api        Up 2 minutes    0.0.0.0:4000->4000/tcp
app_attendance_frontend   Up 2 minutes    0.0.0.0:8080->80/tcp
```

### 4. Ejecutar seed (poblar base de datos)
``` bash
docker exec app_attendance_api npm run seed
```

### 5. Acceder a la aplicación
- Frontend: http://localhost:8080

- Backend API: http://localhost:4000

- Health check: http://localhost:4000/health

### 6. Ver logs si hay problemas
```bash
docker-compose logs api
```

### 7. Detener al terminar
```bash
docker-compose down
```

**Archivo docker-compose.yml**
```yaml
version: '3.8'

services:
  mongo:
    image: mongo:7
    container_name: app_attendance_mongo
    ports:
      - "${MONGO_PORT:-27017}:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER:-admin}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD:-admin123}
    volumes:
      - mongo_data:/data/db
    networks:
      - app_network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 10s
      retries: 5

  api:
    build: ./back
    container_name: app_attendance_api
    ports:
      - "${API_PORT:-4000}:4000"
    environment:
      MONGO_URI: mongodb://${MONGO_USER:-admin}:${MONGO_PASSWORD:-admin123}@mongo:27017/${MONGO_DB:-app_attendance}?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      mongo:
        condition: service_healthy
    volumes:
      - ./back:/app
      - /app/node_modules
    networks:
      - app_network

  app:
    build: ./app
    container_name: app_attendance_frontend
    ports:
      - "${APP_PORT:-8080}:80"
    depends_on:
      - api
    networks:
      - app_network

networks:
  app_network:
    driver: bridge

volumes:
  mongo_data:
    driver: local
```

### Variables de entorno (archivo .env)
```bash
# Servicios
API_PORT=4000
APP_PORT=8080

# MongoDB
MONGO_PORT=27017
MONGO_DB=app_attendance
MONGO_USER=admin
MONGO_PASSWORD=admin123

# Seguridad
JWT_SECRET=tu_secreto_muy_seguro_de_32_caracteres

# QR
QR_DEFAULT_TTL_MINUTES=10
ROOM_CODE_TTL_SECONDS=90
```

### Solución de problemas
**Error: "port is already allocated"**
```bash
# Cambiar puertos en .env
API_PORT=4001
APP_PORT=8081
```
**Error: MongoDB no responde**
```bash
# Verificar logs
docker-compose logs mongo

# Reiniciar MongoDB
docker-compose restart mongo
```
**Error: "no space left on device"**
```bash
# Limpiar contenedores y volúmenes no usados
docker system prune -a
```

### Reconstruir completamente
```bash
docker-compose down -v
docker-compose up -d --build
docker exec app_attendance_api npm run seed
```

### Comandos útiles adicionales
```bash
# Acceder a la terminal del backend
docker exec -it app_attendance_api bash

# Acceder a MongoDB
docker exec -it app_attendance_mongo mongosh -u admin -p admin123

# Ver uso de recursos
docker stats

# Copiar archivos al contenedor
docker cp ./archivo app_attendance_api:/app/
```