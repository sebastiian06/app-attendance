# Sesiones QR - API

## POST /sessions

Crea una nueva sesión de asistencia con QR.

### Request

**URL:** `POST /api/sessions`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```


**Body:**
```json
{
  "institutionId": "65f3a1b2c3d4e5f6a7b8c9d0",
  "unitId": "65f3a1b2c3d4e5f6a7b8c9d2"
}
```

### Response

**201 Created:**
```json
{
  "_id": "65f3a1b2c3d4e5f6a7b8c9d6",
  "institutionId": "65f3a1b2c3d4e5f6a7b8c9d0",
  "unitId": "65f3a1b2c3d4e5f6a7b8c9d2",
  "qrToken": "abc123def456ghi",
  "roomCode": "123456",
  "status": "active",
  "qrExpiresAt": "2026-05-01T15:30:00.000Z",
  "expiresAt": "2026-05-01T15:30:00.000Z",
  "createdAt": "2026-05-01T15:20:00.000Z"
}
```

**404 Not Found:**
```json
{
  "error": "Ya existe una sesión activa para esta unidad",
  "session": { ... }
}
```

## POST /sessions/:sessionId/activate

Activa una sesión existente.

### Request

**URL:** `POST /api/sessions/:sessionId/activate`

**Headers:**
```
Authorization: Bearer <token>
```

### Response

**200 OK:**
```json
{
  "_id": "65f3a1b2c3d4e5f6a7b8c9d6",
  "status": "active",
  ...
}
```

## GET /sessions/:sessionId/results

Obtiene los resultados de asistencia de una sesión.

### Request

**URL:** `GET /api/sessions/:sessionId/results`

**Headers:**
```
Authorization: Bearer <token>
```
### Response

**200 OK:**
```json
{
  "session": {
    "_id": "65f3a1b2c3d4e5f6a7b8c9d6",
    "unitId": "65f3a1b2c3d4e5f6a7b8c9d2",
    "status": "active",
    "expiresAt": "2026-05-01T15:30:00.000Z"
  },
  "students": [
    {
      "_id": "65f3a1b2c3d4e5f6a7b8c9d4",
      "documento": "EST-001",
      "nombre": "Ana María Rodríguez",
      "matricula": "2024001"
    },
    {
      "_id": "65f3a1b2c3d4e5f6a7b8c9d5",
      "documento": "EST-002",
      "nombre": "Carlos Andrés Pérez",
      "matricula": "2024002"
    }
  ],
  "attendance": [
    {
      "_id": "65f3a1b2c3d4e5f6a7b8c9d7",
      "personId": "65f3a1b2c3d4e5f6a7b8c9d4",
      "documento": "EST-001",
      "status": "accepted",
      "registeredAt": "2026-05-01T15:25:00.000Z"
    }
  ],
  "summary": {
    "total": 5,
    "present": 1,
    "absent": 4,
    "attendanceRate": 20
  }
}
```


