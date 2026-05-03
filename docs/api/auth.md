# Autenticación - API

## POST /auth/login

Inicia sesión y obtiene un token JWT.

### Request

**URL:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "documento": "DOCENTE-001",
  "password": "demo123"
}
```

### Response

**200 OK - Éxito:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "documento": "DOCENTE-001",
    "name": "Profesor Juan Pérez",
    "role": "teacher"
  }
}
```

**401 Unauthorized - Credenciales inválidas:**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Documento o contraseña incorrectos"
  }
}
```

## Credenciales de prueba

| Documento	| Contraseña | Institución|
|-----------|------------|------------|
|DOCENTE-001| demo123| Universidad Corhuila|
|DOCENTE-002| demo123|SENA

## Uso del token
Una vez obtenido el token, debe incluirse en todas las peticiones autenticadas:

```json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

