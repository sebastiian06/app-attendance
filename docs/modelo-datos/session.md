# Modelo: Session

## Descripción

Representa una sesión de asistencia generada por un docente. Cada sesión tiene un código QR único y una duración limitada.

## Estructura

| Campo | Tipo | Requerido | Único | Descripción |
|-------|------|-----------|-------|-------------|
| `_id` | ObjectId | Sí | Sí | Identificador único de MongoDB |
| `institutionId` | ObjectId | Sí | No | Referencia a la institución |
| `unitId` | ObjectId | Sí | No | Referencia a la unidad académica |
| `qrToken` | string | Sí | Sí | Token único para el código QR |
| `roomCode` | string | Sí | No | Código numérico de 6 dígitos para la sala |
| `status` | string | Sí | No | `active`, `closed`, `expired` |
| `qrExpiresAt` | Date | Sí | No | Fecha de expiración del QR |
| `expiresAt` | Date | Sí | No | Fecha de expiración de la sesión |
| `createdAt` | Date | Sí | No | Fecha de creación |

## Estados posibles

| Estado | Descripción |
|--------|-------------|
| `active` | Sesión activa, se pueden registrar asistencias |
| `closed` | Sesión cerrada manualmente por el docente |
| `expired` | Sesión expirada por tiempo (10 minutos) |

## Ejemplo

```json
{
  "_id": "65f3a1b2c3d4e5f6a7b8c9d8",
  "institutionId": "65f3a1b2c3d4e5f6a7b8c9d0",
  "unitId": "65f3a1b2c3d4e5f6a7b8c9d2",
  "qrToken": "abc123def456ghi789",
  "roomCode": "123456",
  "status": "active",
  "qrExpiresAt": "2026-05-01T15:30:00.000Z",
  "expiresAt": "2026-05-01T15:30:00.000Z",
  "createdAt": "2026-05-01T15:20:00.000Z"
}
```

## Implementación en Mongoose

```typescript
// back/src/models/session.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  institutionId: mongoose.Types.ObjectId;
  unitId: mongoose.Types.ObjectId;
  qrToken: string;
  roomCode: string;
  status: 'active' | 'closed' | 'expired';
  qrExpiresAt: Date;
  expiresAt: Date;
  createdAt: Date;
}

const sessionSchema = new Schema({
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
  unitId: { type: Schema.Types.ObjectId, ref: 'AcademicUnit', required: true },
  qrToken: { type: String, unique: true, required: true },
  roomCode: { type: String, required: true },
  status: { type: String, enum: ['active', 'closed', 'expired'], default: 'active' },
  qrExpiresAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

sessionSchema.index({ qrToken: 1 });
sessionSchema.index({ unitId: 1, status: 1 });

export const Session = mongoose.model<ISession>('Session', sessionSchema);
```

## Generación de tokens

- qrToken: String aleatorio de 13-17 caracteres alfanuméricos

- roomCode: Número aleatorio de 6 dígitos (ej: 123456)

## Duración

|Parámetro | Valor | Configurable |
|----------|-------|--------------|
|Duración de sesión	| 10 minutos | QR_DEFAULT_TTL_MINUTES |
|Código de sala	| 90 segundos | ROOM_CODE_TTL_SECONDS |

## Relaciones

- Pertenece a una Institution

- Pertenece a una AcademicUnit

- Tiene muchas Attendance (registros de asistencia)

## API Endpoints relacionados

|Método | Endpoint | Descripción |
|-------|----------|-------------|
|POST | /api/sessions | Crear sesión |
|POST | /api/sessions/:id/activate | Activar sesión |
|GET | /api/sessions/:id/results | Ver resultados |
|POST | /api/public/attendance/:token/register | Registrar asistencia (usando qrToken) |
