# Modelo: AcademicUnit

## Descripción

Representa una unidad académica: puede ser una materia (universidad) o una ficha (SENA).

## Estructura

| Campo | Tipo | Requerido | Único | Descripción |
|-------|------|-----------|-------|-------------|
| `_id` | ObjectId | Sí | Sí | Identificador único de MongoDB |
| `institutionId` | ObjectId | Sí | No | Referencia a la institución |
| `code` | string | Sí | Sí | Código de la materia/ficha |
| `name` | string | Sí | No | Nombre de la materia/ficha |
| `type` | string | Sí | No | `materia` o `ficha` |
| `active` | boolean | Sí | No | Estado: activo o inactivo |

## Ejemplo

```json
{
  "_id": "65f3a1b2c3d4e5f6a7b8c9d2",
  "institutionId": "65f3a1b2c3d4e5f6a7b8c9d0",
  "code": "MAT-101",
  "name": "Matemáticas I",
  "type": "materia",
  "active": true
}
```

## Datos de prueba (seed)

```json
[
  {
    "institutionId": "ID_CORHUILA",
    "code": "MAT-101",
    "name": "Matemáticas I",
    "type": "materia",
    "active": true
  },
  {
    "institutionId": "ID_CORHUILA",
    "code": "PROG-201",
    "name": "Programación Web",
    "type": "materia",
    "active": true
  },
  {
    "institutionId": "ID_SENA",
    "code": "FICHA-123",
    "name": "Tecnólogo en Análisis y Desarrollo de Software",
    "type": "ficha",
    "active": true
  }
]
```

## Implementación en Mongoose

```typescript
// back/src/models/academicUnit.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademicUnit extends Document {
  institutionId: mongoose.Types.ObjectId;
  code: string;
  name: string;
  type: 'ficha' | 'materia';
  active: boolean;
}

const AcademicUnitSchema = new Schema({
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['ficha', 'materia'], required: true },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

AcademicUnitSchema.index({ institutionId: 1, code: 1 }, { unique: true });

export default mongoose.model<IAcademicUnit>('AcademicUnit', AcademicUnitSchema);
```

## Relaciones

- Pertenece a una Institution

- Tiene muchas Enrollment (matrículas)

- Tiene muchas Session (sesiones de asistencia)

## API Endpoints relacionados

|Método | Endpoint | Descripción |
|-------|----------|-------------|
|GET | /api/institutions/:id/units | Listar unidades por institución|
|GET | /api/units/:id/students | Listar estudiantes por unidad|

