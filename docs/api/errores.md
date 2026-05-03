# Códigos de Error - API

## Estructura general de errores

Todos los errores siguen este formato:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error",
    "details": [],
    "trace_id": "uuid-demo"
  }
}
```

## Códigos de error por endpoint

### Autenticación (/auth/login)

|Código|	Mensaje	| Descripción|
|------|------------|------------|
|INVALID_CREDENTIALS| Documento o contraseña incorrectos|Credenciales no válidas|
|SERVER_ERROR | Error interno del servidor |Error inesperado|

### Instituciones (/institutions)

|Código	|Mensaje	|Descripción|
|-------|-----------|-----------|
|NOT_FOUND	|No hay instituciones disponibles|	Sin datos en BD|
|UNAUTHORIZED	|Token no proporcionado	|Falta header Authorization|

### Sesiones (/sessions)
|Código	|Mensaje	|Descripción|
|-------|-----------|-----------|
|CONFLICT	|Ya existe una sesión activa para esta unidad	|No se puede crear otra|
|NOT_FOUND|	Sesión no encontrada|	ID inválido|

### Registro Público (/public/attendance)
|Código	|Mensaje	|Descripción|
|-------|-----------|-----------|
|SESSION_EXPIRED	|La sesión ha expirado	|El QR ya no es válido|
|SESSION_NOT_FOUND	|No hay sesión activa con este código QR	|Token inválido|
|DOCUMENT_NOT_FOUND	|Documento no válido o no pertenece a esta institución	|El documento no existe|
|NOT_ENROLLED	|No está inscrito en esta unidad académica	|El estudiante no pertenece a la unidad|
|ALREADY_REGISTERED	|Ya registró su asistencia para esta sesión	|Registro duplicado|

### Códigos HTTP por tipo de error
|Código HTTP	|Uso|
|--------------|---|
|400	|Error de validación en los datos enviados|
|401	|Token no proporcionado o inválido|
|403	|No autorizado para realizar la acción|
|404	|Recurso no encontrado|
|409	|Conflicto con el estado actual|
|500	|Error interno del servidor|

### Ejemplo de error 401 (No autenticado)

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token no proporcionado"
  }
}
```

### Ejemplo de error 404 (Recurso no encontrado)

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "No hay estudiantes inscritos en esta unidad"
  }
}
```

### Validación de errores en el frontend
```typescript
try {
  await registerAttendance(token, documento);
} catch (err: any) {
  if (err.message.includes('expirada')) {
    // Mostrar: "La sesión ha expirado"
  } else if (err.message.includes('ya registró')) {
    // Mostrar: "Ya registró su asistencia"
  } else {
    // Mostrar: "Error al registrar asistencia"
  }
}
```