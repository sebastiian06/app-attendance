# Instituciones y Unidades - API

## GET /institutions

Obtiene la lista de instituciones activas.

### Request

**URL:** `GET /api/institutions`

**Headers:**
```
Authorization: Bearer <token>
```

### Response

**200 OK:**
```json
[
  {
    "_id": "65f3a1b2c3d4e5f6a7b8c9d0",
    "code": "CORHUILA",
    "name": "Universidad Corhuila",
    "context": "university",
    "labels": ["pregrado", "posgrado"],
    "active": true
  },
  {
    "_id": "65f3a1b2c3d4e5f6a7b8c9d1",
    "code": "SENA",
    "name": "SENA",
    "context": "technical",
    "labels": ["tecnólogo", "técnico"],
    "active": true
  }
]
```
## GET /institutions/:institutionId/units

Obtiene las unidades académicas (materias/fichas) de una institución.

### Request

**URL:** `GET /api/institutions/:institutionId/units`

**Headers:**
```
Authorization: Bearer <token>
```

**Parámetros:**
|Parámetro|	Tipo|	Descripción|
|---------|-----|--------------|
|institutionId	|string	|ID de la institución|

### Response

**200 OK:**
```json
[
  {
    "_id": "65f3a1b2c3d4e5f6a7b8c9d2",
    "institutionId": {
      "_id": "65f3a1b2c3d4e5f6a7b8c9d0",
      "name": "Universidad Corhuila",
      "code": "CORHUILA"
    },
    "code": "MAT-101",
    "name": "Matemáticas I",
    "type": "materia",
    "active": true
  },
  {
    "_id": "65f3a1b2c3d4e5f6a7b8c9d3",
    "code": "PROG-201",
    "name": "Programación Web",
    "type": "materia",
    "active": true
  }
]
```

**404 Not Found:**
```json

{
  "error": "No hay unidades académicas disponibles para esta institución"
}
```

## GET /units/:unitId/students

Obtiene los estudiantes inscritos en una unidad académica.

### Request

**URL:** `GET /api/units/:unitId/students`

**Headers:**
```
Authorization: Bearer <token>
```

**Parámetros:**
|Parámetro|	Tipo	|Descripción|
|---------|---------|-----------|
|unitId	| string	| ID de la unidad académica|


### Response

**200 OK:**
```json
[
  {
    "_id": "65f3a1b2c3d4e5f6a7b8c9d4",
    "documento": "EST-001",
    "nombre": "Ana María Rodríguez",
    "matricula": "2024001",
    "roles": ["student"]
  },
  {
    "_id": "65f3a1b2c3d4e5f6a7b8c9d5",
    "documento": "EST-002",
    "nombre": "Carlos Andrés Pérez",
    "matricula": "2024002",
    "roles": ["student"]
  }
]
```

**404 Not Found:**
```json
{
  "error": "No hay estudiantes inscritos en esta unidad"
}
```