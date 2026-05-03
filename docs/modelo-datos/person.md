# Modelo: Person

## Descripción

Representa una persona en el sistema: puede ser docente o estudiante.

## Estructura

| Campo | Tipo | Requerido | Único | Descripción |
|-------|------|-----------|-------|-------------|
| `_id` | ObjectId | Sí | Sí | Identificador único de MongoDB |
| `institutionId` | ObjectId | Sí | No | Referencia a la institución |
| `documento` | string | Sí | Sí | Número de identificación |
| `nombre` | string | Sí | No | Nombre completo |
| `matricula` | string | No | No | Código de matrícula (solo estudiantes) |
| `roles` | array[string] | Sí | No | `teacher`, `student` |

## Ejemplo (Estudiante)

```json
{
  "_id": "65f3a1b2c3d4e5f6a7b8c9d4",
  "institutionId": "65f3a1b2c3d4e5f6a7b8c9d0",
  "documento": "EST-001",
  "nombre": "Ana María Rodríguez",
  "matricula": "2024001",
  "roles": ["student"]
}
```

## Ejemplo (Docente)

```json
{
  "_id": "65f3a1b2c3d4e5f6a7b8c9d6",
  "institutionId": "65f3a1b2c3d4e5f6a7b8c9d0",
  "documento": "DOCENTE-001",
  "nombre": "Profesor Juan Pérez",
  "roles": ["teacher"]
}
```

## Datos de prueba (seed)

```json
[
  // Estudiantes CORHUILA
  {
    "institutionId": "ID_CORHUILA",
    "documento": "EST-001",
    "nombre": "Ana María Rodríguez",
    "matricula": "2024001",
    "roles": ["student"]
  },
  {
    "institutionId": "ID_CORHUILA",
    "documento": "EST-002",
    "nombre": "Carlos Andrés Pérez",
    "matricula": "2024002",
    "roles": ["student"]
  },
  // Estudiantes SENA
  {
    "institutionId": "ID_SENA",
    "documento": "APR-001",
    "nombre": "Juan David Martínez",
    "matricula": "ADS-123-001",
    "roles": ["student"]
  },
  // Docentes
  {
    "institutionId": "ID_CORHUILA",
    "documento": "DOCENTE-001",
    "nombre": "Profesor Juan Pérez",
    "roles": ["teacher"]
  },
  {
    "institutionId": "ID_SENA",
    "documento": "DOCENTE-002",
    "nombre": "Instructora María Gómez",
    "roles": ["teacher"]
  }
]
```

## Implementación en Mongoose

```typescript
// back/src/models/person.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPerson extends Document {
  institutionId: mongoose.Types.ObjectId;
  documento: string;
  nombre: string;
  matricula?: string;
  roles: string[];
}

const PersonSchema = new Schema({
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
  documento: { type: String, required: true },
  nombre: { type: String, required: true },
  matricula: { type: String },
  roles: [{ type: String, enum: ['teacher', 'student'] }]
}, {
  timestamps: true
});

PersonSchema.index({ institutionId: 1, documento: 1 }, { unique: true });

export default mongoose.model<IPerson>('Person', PersonSchema);
```

## Roles disponibles

|Rol | Descripción | Uso |
|----|-------------|-----|
|teacher | Docente/instructor | Login, crear sesiones QR, ver resultados|
|student | Estudiante/aprendiz | Registrar asistencia por QR|

## Relaciones

- Pertenece a una Institution

- Tiene muchas Enrollment (materias/fichas inscritas)

- Tiene muchas Attendance (registros de asistencia)

## API Endpoints relacionados

|Método | Endpoint | Descripción |
|-------|----------|-------------|
|POST | /api/auth/login | Login de docente|
|POST | /api/public/attendance/:token/register | Registro de estudiante|