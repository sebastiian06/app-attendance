# Modelo: Enrollment

## Descripción

Representa la relación entre una persona (estudiante) y una unidad académica (materia/ficha). Es decir, representa la matrícula o inscripción.

## Estructura

| Campo | Tipo | Requerido | Único | Descripción |
|-------|------|-----------|-------|-------------|
| `_id` | ObjectId | Sí | Sí | Identificador único de MongoDB |
| `institutionId` | ObjectId | Sí | No | Referencia a la institución |
| `unitId` | ObjectId | Sí | Sí* | Referencia a la unidad académica |
| `personId` | ObjectId | Sí | Sí* | Referencia a la persona |
| `active` | boolean | Sí | No | Matrícula activa o inactiva |

*Índice compuesto único: `unitId + personId`

## Ejemplo

```json
{
  "_id": "65f3a1b2c3d4e5f6a7b8c9d7",
  "institutionId": "65f3a1b2c3d4e5f6a7b8c9d0",
  "unitId": "65f3a1b2c3d4e5f6a7b8c9d2",
  "personId": "65f3a1b2c3d4e5f6a7b8c9d4",
  "active": true
}
```

## Datos de prueba (seed)

```json
[
  // Todos los estudiantes de CORHUILA en Matemáticas I
  {
    "institutionId": "ID_CORHUILA",
    "unitId": "ID_MATEMATICAS",
    "personId": "ID_EST_001",
    "active": true
  },
  {
    "institutionId": "ID_CORHUILA",
    "unitId": "ID_MATEMATICAS",
    "personId": "ID_EST_002",
    "active": true
  },
  // Todos los estudiantes de SENA en Ficha Software
  {
    "institutionId": "ID_SENA",
    "unitId": "ID_FICHA_SOFTWARE",
    "personId": "ID_APR_001",
    "active": true
  }
]
```

## Implementación en Mongoose

```typescript
// back/src/models/enrollment.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
  institutionId: mongoose.Types.ObjectId;
  unitId: mongoose.Types.ObjectId;
  personId: mongoose.Types.ObjectId;
  active: boolean;
}

const EnrollmentSchema = new Schema({
  institutionId: { type: Schema.Types.ObjectId, required: true },
  unitId: { type: Schema.Types.ObjectId, ref: 'AcademicUnit', required: true },
  personId: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

EnrollmentSchema.index({ unitId: 1, personId: 1 }, { unique: true });

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
```

## Relaciones

- Pertenece a una Institution

- Pertenece a una AcademicUnit (materia/ficha)

- Pertenece a una Person (estudiante)

## Validaciones

- Una persona no puede estar matriculada dos veces en la misma unidad

- Solo estudiantes pueden tener matrículas (aunque el modelo no lo fuerza directamente)

## API Endpoints relacionados

|Método | Endpoint | Descripción |
|-------|----------|-------------|
|GET | 	/api/units/:id/students | Listar estudiantes de una unidad|