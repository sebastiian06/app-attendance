# Registro Público de Asistencia - API

## POST /public/attendance/:token/register

Registra la asistencia de un estudiante. Este endpoint es **público** (no requiere autenticación).

### Request

**URL:** `POST /api/public/attendance/:token/register`

**Headers:**
```
Content-Type: application/json
```

**Parámetros URL:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `token` | string | Token QR de la sesión (ej: abc123def456ghi) |

**Body:**
```json
{
  "documento": "EST-001"
}
```

### Response

**200 OK - Éxito:**
```json
{
  "success": true,
  "message": "Asistencia registrada exitosamente",
  "data": {
    "nombre": "Ana María Rodríguez",
    "documento": "EST-001",
    "registeredAt": "2026-05-01T15:25:00.000Z"
  }
}
```

### Códigos de error

**400 Bad Request - Sesión expirada:**
```json
{
  "error": "La sesión ha expirado"
}
```

**404 Not Found - Sesión no encontrada:**
```json
{
  "error": "No hay sesión activa con este código QR"
}
```

**404 Not Found - Documento no válido:**
```json
{
  "error": "Documento no válido o no pertenece a esta institución"
}
```

**403 Forbidden - No inscrito:**
```json
{
  "error": "No está inscrito en esta unidad académica"
}
```

**409 Conflict - Ya registró:**
```json
{
  "error": "Ya registró su asistencia para esta sesión"
}
```

## Flujo de registro

1. Estudiante escanea QR con su teléfono
2. Se abre la página: http://localhost:5173/attendance/{token}
3. Estudiante ingresa su número de documento
4. Se envía POST a este endpoint
5. Backend valida:
   - Sesión existe y está activa
   - Sesión no ha expirado
   - Documento pertenece a la institución
   - Estudiante está inscrito en la unidad
   - No ha registrado antes
6. Se guarda el registro de asistencia
7. Se retorna éxito al estudiante

## Documentos de prueba

|Institución	|Documentos válidos|
|---------------|------------------|
|Universidad Corhuila	|EST-001, EST-002, EST-003, EST-004, EST-005|
|SENA|	APR-001, APR-002, APR-003, APR-004, APR-005|

