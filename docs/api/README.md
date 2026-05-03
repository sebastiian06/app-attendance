# API Reference - App Attendance

## Base URL

| Entorno | URL |
|---------|-----|
| **Desarrollo local** | `http://localhost:4000/api` |
| **Docker** | `http://localhost:4000/api` |
| **Android (emulador)** | `http://10.0.2.2:4000/api` |

## Autenticación

La mayoría de los endpoints requieren autenticación mediante JWT.

**Header requerido:**
Authorization: Bearer <tu-token-jwt>


**Endpoints públicos (sin autenticación):**
- `POST /api/auth/login`
- `POST /api/public/attendance/:token/register`
- `GET /api/health`

## Índice de endpoints

| Método | Endpoint | Descripción | Archivo |
|--------|----------|-------------|---------|
| POST | `/auth/login` | Inicio de sesión | [auth.md](./auth.md) |
| GET | `/institutions` | Lista instituciones | [institutions.md](./institutions.md) |
| GET | `/institutions/:id/units` | Unidades por institución | [institutions.md](./institutions.md) |
| GET | `/units/:id/students` | Estudiantes por unidad | [institutions.md](./institutions.md) |
| POST | `/sessions` | Crear sesión QR | [sessions.md](./sessions.md) |
| POST | `/sessions/:id/activate` | Activar sesión | [sessions.md](./sessions.md) |
| GET | `/sessions/:id/results` | Resultados de asistencia | [sessions.md](./sessions.md) |
| POST | `/public/attendance/:token/register` | Registrar asistencia | [attendance.md](./attendance.md) |
| GET | `/health` | Health check | - |

## Códigos de respuesta comunes

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Creado |
| 400 | Error de validación |
| 401 | No autenticado |
| 403 | No autorizado |
| 404 | No encontrado |
| 409 | Conflicto |
| 500 | Error interno |

Ver [errores.md](./errores.md) para detalles completos.