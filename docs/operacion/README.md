# Operación - App Attendance

## Guía de operación del sistema

Esta sección contiene toda la documentación necesaria para poner en marcha y operar el sistema.

## Índice

| Documento | Descripción |
|-----------|-------------|
| [Instalación local](./instalacion.md) | Cómo ejecutar el proyecto sin Docker |
| [Docker Compose](./docker.md) | Cómo levantar todo con Docker |
| [Seed de datos](./seed.md) | Cómo poblar la base de datos con datos de prueba |
| [Despliegue en producción](./despliegue.md) | Consideraciones para producción |

## Requisitos mínimos

| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| RAM | 4GB | 8GB |
| Disco | 2GB | 10GB |
| CPU | 2 núcleos | 4 núcleos |

## Software requerido

| Software | Versión | Para |
|----------|---------|------|
| Node.js | 18.x o superior | Desarrollo local |
| Docker Desktop | 24.x o superior | Contenedores |
| MongoDB | 7.x (opcional) | BD nativa |
| Git | Cualquiera | Clonar repositorio |

## Puertos utilizados

| Servicio | Puerto | Docker |
|----------|--------|--------|
| Backend API | 4000 | 4000 |
| Frontend (dev) | 5173 | - |
| Frontend (Docker) | - | 8080 |
| MongoDB | 27017 | 27017 |

## Flujo de operación básico

1. Clonar repositorio

2. Configurar variables de entorno

3. Levantar servicios (Docker o local)

4. Ejecutar seed (solo primera vez)

5. Acceder a la aplicación

6. Usar credenciales de prueba


## Enlaces rápidos

- [Volver a documentación principal](../README.md)