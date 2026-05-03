# Modelo: Attendance

## Descripción

Representa un registro de asistencia de un estudiante a una sesión específica.

## Estructura

| Campo | Tipo | Requerido | Único | Descripción |
|-------|------|-----------|-------|-------------|
| `_id` | ObjectId | Sí | Sí | Identificador único de MongoDB |
| `sessionId` | ObjectId | Sí | Sí* | Referencia a la sesión |
| `personId` | ObjectId | Sí | Sí* | Referencia a la persona (estudiante) |
| `documento` | string | Sí | No | Número de documento (denormalizado) |
| `status` | string | Sí | No | `accepted` o `rejected` |
| `rejectReason` | string | No | No | Razón de rechazo (si aplica) |
| `registeredAt` | Date | Sí | No | Fecha y hora del registro |

*Índice compuesto único: `sessionId + personId` (evita doble registro)

## Estados posibles

| Estado | Descripción |
|--------|-------------|
| `accepted` | Asistencia registrada exitosamente |
| `rejected` | Intento fallido (documento inválido, sesión expirada, etc.) |

## Ejemplo (Éxito)

```json
{
  "_id": "65f3a1b2c3d4e5f6a7b8c9d9",
  "sessionId": "65f3a1b2c3d4e5f6a7b8c9d8",
  "personId": "65f3a1b2c3d4e5f6a7b8c9d4",
  "documento": "EST-001",
  "status": "accepted",
  "registeredAt": "2026-05-01T15:25:00.000Z"
}
```

## Ejemplo (Rechazo)

```json
{
  "_id": "65f3a1b2c3d4e5f6a7b8c9e0",
  "sessionId": "65f3a1b2c3d4e5f6a7b8c9d8",
  "personId": null,
  "documento": "INVALIDO-999",
  "status": "rejected",
  "rejectReason": "Documento no pertenece a la institución",
  "registeredAt": "2026-05-01T15:26:00.000Z"
}
```

## Implementación en Mongoose

```typescript
// back/src/models/attendance.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  sessionId: mongoose.Types.ObjectId;
  personId: mongoose.Types.ObjectId;
  documento: string;
  status: 'accepted' | 'rejected';
  rejectReason?: string;
  registeredAt: Date;
}

const attendanceSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  personId: { type: Schema.Types.ObjectId, ref: 'Person' },
  documento: { type: String, required: true },
  status: { type: String, enum: ['accepted', 'rejected'], default: 'accepted' },
  rejectReason: { type: String },
  registeredAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

attendanceSchema.index({ sessionId: 1, personId: 1 }, { unique: true });
attendanceSchema.index({ sessionId: 1, status: 1 });

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);
```

## Razones de rechazo comunes

|Razón | Descripción |
|------|-------------|
|Documento no pertenece a la institución | El documento no existe en la BD|
|Ya registró su asistencia para esta sesión | Intento duplicado|
|No está inscrito en esta unidad académica | El estudiante no pertenece a la materia/ficha|
|La sesión ha expirado | El QR ya no es válido|
|No hay sesión activa con este código QR | Token inválido o sesión cerrada|

## Relaciones
- Pertenece a una Session

- Pertenece a una Person (solo si status = accepted)

## Validaciones
- Una persona no puede registrar asistencia dos veces en la misma sesión

- Solo se aceptan documentos de estudiantes inscritos en la unidad

## API Endpoints relacionados
|Método | Endpoint | Descripción|
|-------|----------|------------|
|POST | /api/public/attendance/:token/register | Registrar asistencia|
|GET | /api/sessions/:id/results | Consultar resultados|

