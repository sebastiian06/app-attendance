# Modelo de Datos - MongoDB

## Diagrama de Relaciones

```
┌───────────────────────────────────────────────────────────────┐
│                      MongoDB Collections                      │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│   ┌──────────────┐     ┌──────────────┐    ┌──────────────┐   │
│   │ Institution  │────<│ AcademicUnit │    │ Person       │   │
│   │              │     │              │    │              │   │
│   │ - _id        │     │ - _id        │    │ - _id        │   │
│   │ - code       │     │ - institutId │    │ - documen..  │   │
│   │ - name       │     │ - code       │    │ - nombre     │   │
│   │ - context    │     │ - name       │    │ - roles      │   │
│   │ - labels     │     │ - type       │    │ - matricula  │   │
│   │ - active     │     │ - active     │    │              │   │
│   └──────────────┘     └──────┬───────┘    └──────┬───────┘   │
│                               │                   │           │
│                               │                   │           │
│                               ▼                   ▼           │
│                         ┌──────────────┐   ┌──────────────┐   │
│                         │ Enrollment   │──<│ Attendance   │   │
│                         │              │   │              │   │
│                         │ - _id        │   │ - _id        │   │
│                         │ - unitId     │   │ - sessionId  │   │
│                         │ - personId   │   │ - personId   │   │
│                         │ - active     │   │ - documento  │   │
│                         └──────┬───────┘   │ - status     │   │
│                                │           │ - regisAt    │   │
│                                │           └──────┬───────┘   │
│                                │                  │           │
│                                │                  ▼           │
│                                │           ┌──────────────┐   │
│                                │           │ Session      │   │
│                                │           │              │   │
│                                └──────────>│ - _id        │   │
│                                            │ - unitId     │   │
│                                            │ - institutId │   │
│                                            │ - qrToken    │   │
│                                            │ - roomCode   │   │
│                                            │ - status     │   │
│                                            │ - expiresAt  │   │
│                                            └──────────────┘   │
│                                                               │ 
└───────────────────────────────────────────────────────────────┘
```


## Relaciones

| Relación | Tipo | Descripción |
|----------|------|-------------|
| Institution → AcademicUnit | Uno a muchos | Una institución tiene muchas unidades |
| AcademicUnit → Enrollment | Uno a muchos | Una unidad tiene muchas matrículas |
| Person → Enrollment | Uno a muchos | Una persona puede estar en muchas unidades |
| AcademicUnit → Session | Uno a muchos | Una unidad puede tener muchas sesiones |
| Session → Attendance | Uno a muchos | Una sesión tiene muchos registros |
| Person → Attendance | Uno a muchos | Una persona puede tener muchos registros |

## Índices para rendimiento

| Colección | Índice | Tipo | Propósito |
|-----------|--------|------|-----------|
| `institutions` | `code` | Único | Buscar por código |
| `academicunits` | `code` | Único | Buscar por código |
| `academicunits` | `institutionId + code` | Único compuesto | Evitar duplicados |
| `people` | `documento` | Único | Buscar por documento |
| `people` | `institutionId + documento` | Único compuesto | Evitar duplicados |
| `enrollments` | `unitId + personId` | Único compuesto | Evitar matrículas duplicadas |
| `sessions` | `qrToken` | Único | Buscar por token QR |
| `sessions` | `status + expiresAt` | Simple | Buscar sesiones activas |
| `attendances` | `sessionId + personId` | Único compuesto | Evitar doble registro |

## Colecciones

| Colección | Documentos | Descripción |
|-----------|------------|-------------|
| `institutions` | 2 | CORHUILA, SENA |
| `academicunits` | 5 | Materias y fichas |
| `people` | 12 | Estudiantes + docentes |
| `enrollments` | 19 | Relaciones persona-unidad |
| `sessions` | Variable | Sesiones QR activas/cerradas |
| `attendances` | Variable | Registros de asistencia |

## Enlaces a modelos detallados

- [Institution](./institution.md)
- [AcademicUnit](./academic-unit.md)
- [Person](./person.md)
- [Enrollment](./enrollment.md)
- [Session](./session.md)
- [Attendance](./attendance.md)