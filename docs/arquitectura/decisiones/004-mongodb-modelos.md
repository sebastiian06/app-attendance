# ADR-004: MongoDB como base de datos y diseño de modelos

## Datos básicos

| Campo | Valor |
|-------|-------|
| **Fecha** | 2026-05-01 |
| **Estado** | ✅ Aceptado |
| **Decisión final** | Utilizar MongoDB como base de datos NoSQL |
| **Responsable** | Equipo de desarrollo |

## Contexto

El sistema necesita almacenar:

1. Instituciones educativas
2. Unidades académicas (materias/fichas)
3. Personas (docentes y estudiantes)
4. Relaciones entre personas y unidades (matrículas)
5. Sesiones de asistencia con QR
6. Registros de asistencia

Se debe elegir la tecnología de base de datos y definir el modelo de datos.

## Opciones consideradas

### Opción A: MongoDB (NoSQL)

**Ventajas:**
- Esquema flexible
- Fácil integración con Node.js (Mongoose)
- Documentos JSON nativos
- Ideal para prototipos rápidos
- Escala horizontalmente

**Desventajas:**
- No tiene joins nativos (se usan population)
- Consistencia eventual (no es problema para este caso)

### Opción B: PostgreSQL (SQL)

**Ventajas:**
- Integridad referencial estricta
- Joins nativos
- Madurez y estabilidad

**Desventajas:**
- Esquema rígido (más difícil de modificar)
- Mayor complejidad inicial
- Migraciones más complicadas

### Opción C: SQLite

**Ventajas:**
- Sin servidor, archivo único
- Muy ligero

**Desventajas:**
- No ideal para concurrencia
- No escalable
- No funciona bien con Docker

## Decisión

**Se acepta la Opción A: MongoDB**

### Justificación

1. **Flexibilidad**: Permite iterar rápido durante el desarrollo
2. **Ecosistema Node.js**: Mongoose es muy maduro y fácil de usar
3. **JSON nativo**: No hay transformación de datos
4. **Docker**: Fácil de contenerizar
5. **Seed**: Datos de prueba fáciles de generar

### Modelos de datos

#### 1. Institution (Institución educativa)

```json
{
  "_id": "ObjectId",
  "code": "CORHUILA",
  "name": "Universidad Corhuila",
  "context": "university",
  "labels": ["pregrado", "posgrado"],
  "active": true
}
```

#### 2. AcademicUnit (Unidad académica - materia/ficha)
```json
{
  "_id": "ObjectId",
  "institutionId": "ObjectId",
  "code": "MAT-101",
  "name": "Matemáticas I",
  "type": "materia",
  "active": true
}
```

#### 3. Person (Persona - docente/estudiante)
```json
{
  "_id": "ObjectId",
  "institutionId": "ObjectId",
  "documento": "EST-001",
  "nombre": "Ana María Rodríguez",
  "matricula": "2024001",
  "roles": ["student"]
}
```

#### 4. Enrollment (Matrícula - relación persona-unidad)
```json
{
  "_id": "ObjectId",
  "institutionId": "ObjectId",
  "unitId": "ObjectId",
  "personId": "ObjectId",
  "active": true
}
```
#### 5. Session (Sesión de asistencia)
```json
{
  "_id": "ObjectId",
  "institutionId": "ObjectId",
  "unitId": "ObjectId",
  "qrToken": "abc123xyz",
  "roomCode": "123456",
  "status": "active",
  "qrExpiresAt": "2026-05-01T15:30:00Z",
  "expiresAt": "2026-05-01T15:30:00Z",
  "createdAt": "2026-05-01T15:20:00Z"
}
```

#### 6. Attendance (Registro de asistencia)
```json
{
  "_id": "ObjectId",
  "sessionId": "ObjectId",
  "personId": "ObjectId",
  "documento": "EST-001",
  "status": "accepted",
  "registeredAt": "2026-05-01T15:25:00Z"
}
```

## Diagrama de relaciones
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Institution  │────<│ AcademicUnit │     │    Person    │
│ - _id        │     │ - _id        │     │ - _id        │
│ - code       │     │ - institutId │     │ - documen..  │
│ - name       │     │ - code       │     │ - nombre     │
└──────────────┘     │ - name       │     │ - roles      │
                     └──────┬───────┘     └──────┬───────┘
                            │                    │
                            │                    │
                     ┌──────┴───────┐     ┌──────┴───────┐
                     │  Enrollment  │────<│  Attendance  │
                     │ - _id        │     │ - _id        │
                     │ - unitId     │     │ - sessionId  │
                     │ - personId   │     │ - personId   │
                     └──────────────┘     └──────┬───────┘
                                                  │
                                           ┌──────┴───────┐
                                           │   Session    │
                                           │ - _id        │
                                           │ - unitId     │
                                           │ - qrToken    │
                                           └──────────────┘
```
## Índices para rendimiento

|Colección|	Índice|	Tipo|
|-------|-------|-------|
|people |	documento	| Único |
|academicunits |	code |	Único |
|enrollments |	unitId + personId |	Único compuesto
|sessions | qrToken | Único |
|sessions | status + expiresAt | Simple|
|attendances | sessionId + personId | Único compuesto

## Consecuencias

### Positivas
✅ Esquema flexible para cambios futuros

✅ Fácil de poblar con datos de prueba (seed)

✅ Integración perfecta con Mongoose

✅ Documentos autodescriptivos

### Negativas
⚠️ No hay integridad referencial nativa

⚠️ Joins simulados con populate()

⚠️ Consistencia eventual (no crítica)

## Estados de la decisión
- [X] Propuesta
- [X] Analizada
- [X] Aceptada
- [X] Implementada
- [X] Superada

## Referencias

- [MongoDB Official Documentation](https://www.mongodb.com/es/docs/)

- [Mongoose ODM](https://mongoosejs.com/)

- [MongoDB Schema Design Best Practices](https://www.mongodb.com/es/docs/manual/data-modeling/design-patterns/)