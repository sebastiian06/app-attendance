# ADR-002: Uso de Docker Compose para orquestación

## Datos básicos

| Campo | Valor |
|-------|-------|
| **Fecha** | 2026-05-01 |
| **Estado** | ✅ Aceptado |
| **Decisión final** | Utilizar Docker Compose para levantar todos los servicios |
| **Responsable** | Equipo de desarrollo |

## Contexto

El proyecto requiere tres servicios que deben ejecutarse simultáneamente:

1. **MongoDB** - Base de datos
2. **Backend API** - Node.js + Express
3. **Frontend** - Ionic React (servido con nginx)

Se necesita una forma reproducible y portable de levantar todos los servicios.

## Opciones consideradas

### Opción A: Docker Compose

**Ventajas:**
- Un solo comando: `docker-compose up -d`
- Reproducible en cualquier máquina con Docker
- Red interna automática entre contenedores
- Persistencia de datos con volúmenes

**Desventajas:**
- Requiere Docker instalado
- Curva de aprendizaje inicial

### Opción B: Ejecución manual (npm run dev en cada uno)

**Ventajas:**
- No requiere Docker
- Más ligero localmente

**Desventajas:**
- Tres terminales abiertas
- Configuración manual de MongoDB
- Difícil de replicar en otra máquina
- Problemas de versiones de Node

### Opción C: Scripts de automatización (bash/PowerShell)

**Ventajas:**
- Menos dependencias que Docker

**Desventajas:**
- No funciona igual en Windows/Mac/Linux
- Difícil manejar puertos en conflicto

## Decisión

**Se acepta la Opción A: Docker Compose**

### Justificación

1. **Portabilidad**: Funciona igual en Windows, Mac y Linux
2. **Reproducibilidad**: Configuración declarativa en YAML
3. **Facilidad para el profesor**: Un comando para evaluar el proyecto
4. **Aislamiento**: No contamina el sistema anfitrión
5. **Persistencia**: Los datos de MongoDB persisten entre reinicios

### Detalles de implementación

```yaml
# docker-compose.yml
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
### Comandos de operación
```
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reconstruir después de cambios
docker-compose up -d --build

# Ejecutar seed
docker exec app_attendance_api npm run seed
```
## Consecuencias

### Positivas:

✅ Un comando para todo el sistema

✅ Ambiente idéntico en cualquier máquina

✅ Fácil de presentar al profesor

✅ Los datos persisten entre ejecuciones

✅ Ideal para evaluaciones

### Negativas:

⚠️ Requiere instalar Docker Desktop (gratuito)

⚠️ Consume más recursos que ejecución nativa

⚠️ Curva de aprendizaje inicial

## Estados de la decisión:
- [X] Propuesta
- [X] Analizada
- [X] Aceptada
- [X] Implementada
- [X] Superada

## Referencias:

- Documentación oficial de Docker Compose

- Mejores prácticas para Node.js con Docker