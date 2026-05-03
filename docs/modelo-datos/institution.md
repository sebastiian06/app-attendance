# Modelo: Institution

## Descripción

Representa una institución educativa (universidad, SENA, colegio) que utiliza el sistema.

## Estructura

| Campo | Tipo | Requerido | Único | Descripción |
|-------|------|-----------|-------|-------------|
| `_id` | ObjectId | Sí | Sí | Identificador único de MongoDB |
| `code` | string | Sí | Sí | Código corto de la institución (ej: CORHUILA, SENA) |
| `name` | string | Sí | No | Nombre completo de la institución |
| `context` | string | Sí | No | Tipo: `university` o `technical` |
| `labels` | array[string] | No | No | Etiquetas para categorización |
| `active` | boolean | Sí | No | Estado: activo o inactivo |

## Ejemplo

```json
{
  "_id": "65f3a1b2c3d4e5f6a7b8c9d0",
  "code": "CORHUILA",
  "name": "Universidad Corhuila",
  "context": "university",
  "labels": ["pregrado", "posgrado"],
  "active": true
}
```

## Datos de prueba (seed)

```json
[
  {
    "code": "CORHUILA",
    "name": "Universidad Corhuila",
    "context": "university",
    "labels": ["pregrado", "posgrado"],
    "active": true
  },
  {
    "code": "SENA",
    "name": "SENA",
    "context": "technical",
    "labels": ["tecnólogo", "técnico"],
    "active": true
  }
]
```

## Implementación en Mongoose

```typescript
// back/src/models/institution.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IInstitution extends Document {
  code: string;
  name: string;
  context: string;
  labels: string[];
  active: boolean;
}

const InstitutionSchema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  context: { type: String, required: true },
  labels: [String],
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IInstitution>('Institution', InstitutionSchema);
```

## Relaciones

- Una Institution tiene muchas AcademicUnit (unidades académicas)

- Una Institution tiene muchas Person (personas)

- Una Institution tiene muchas Enrollment (matrículas)

## API Endpoints relacionados

|Método | Endpoint | Descripción |
|-------|----------|-------------|
|GET | /api/institutions | Listar todas las instituciones|
|GET | /api/institutions/:id/units | Listar unidades de una institución|