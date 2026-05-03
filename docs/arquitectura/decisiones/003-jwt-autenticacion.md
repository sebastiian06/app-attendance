# ADR-003: Autenticación con JWT

## Datos básicos

| Campo | Valor |
|-------|-------|
| **Fecha** | 2026-05-01 |
| **Estado** | ✅ Aceptado |
| **Decisión final** | Implementar autenticación mediante JSON Web Tokens (JWT) |
| **Responsable** | Equipo de desarrollo |

## Contexto

El sistema necesita identificar y autorizar a los docentes que utilizan la aplicación. Se requiere:

1. Los docentes deben iniciar sesión con documento y contraseña
2. Las peticiones a la API deben estar autenticadas
3. Las sesiones deben tener expiración
4. La ruta de registro de asistencia (QR) debe ser pública

## Opciones consideradas

### Opción A: JWT (JSON Web Token)

**Ventajas:**
- Stateless (no requiere almacenar sesiones en BD)
- Fácil de implementar
- El token contiene información del usuario
- Expiración automática

**Desventajas:**
- No se puede invalidar fácilmente antes de expiración
- El token viaja en cada petición

### Opción B: Sesiones con cookies

**Ventajas:**
- El servidor controla la sesión
- Se puede invalidar fácilmente

**Desventajas:**
- Stateful (requiere almacenar sesión)
- Más complejo en móvil
- Problemas con CORS

### Opción C: API Key

**Ventajas:**
- Simple de implementar

**Desventajas:**
- No hay diferenciación por usuario
- Difícil de revocar
- Menos seguro

## Decisión

**Se acepta la Opción A: JWT (JSON Web Token)**

### Justificación

1. **Stateless**: No necesita almacenar sesiones, ideal para escalar
2. **Compatibilidad móvil**: Funciona perfectamente con Capacitor/Android
3. **Expiración**: Configurable (8 horas por defecto)
4. **Información embebida**: El token contiene el documento y rol del usuario
5. **Simple**: Fácil de implementar y entender

### Detalles de implementación

#### Generación del token (login)
```typescript
// back/src/controllers/auth.controller.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'temp-secret-key';

export const login = async (req: Request, res: Response) => {
  const { documento, password } = req.body;
  
  // Validar credenciales (demo)
  if (documento === 'DOCENTE-001' && password === 'demo123') {
    const token = jwt.sign(
      { documento, role: 'teacher' },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    res.json({ token, user: { documento, name: 'Docente' } });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
};
```

#### Middleware de autenticación
```typescript
// back/src/middleware/auth.ts
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
```

#### Uso en rutas
```typescript
// back/src/routes/institution.routes.ts
router.get('/institutions', authenticate, getInstitutions);
router.get('/institutions/:id/units', authenticate, getAcademicUnits);
router.get('/units/:id/students', authenticate, getStudentsByUnit);
router.post('/sessions', authenticate, createSession);
```

#### Rutas públicas (sin autenticación)
```typescript
// back/src/routes/public.routes.ts
router.post('/public/attendance/:token/register', registerPublicAttendance);
```

#### Frontend - Almacenamiento del token
```typescript
// app/src/services/api.ts
localStorage.setItem('token', data.token);

// En cada petición
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```
### Flujo de autenticación

1. Docente ingresa credenciales
2. Backend valida y genera JWT
3. Frontend guarda token en localStorage
4. Frontend incluye token en cada petición (Header Authorization)
5. Backend valida token antes de procesar
6. Token expira después de 8 horas

## Consecuencias

### Positivas:

✅ Sin necesidad de almacenar sesiones en BD

✅ El token contiene información del usuario

✅ Fácil de usar en múltiples dispositivos

✅ Escalable horizontalmente

### Negativas:

⚠️ No se puede invalidar un token antes de su expiración

⚠️ El token puede ser interceptado (mitigado con HTTPS en producción)

⚠️ Requiere manejar expiración en el frontend

## Mitigaciones para producción

|Problema| Solución |
|-----------|-------------|
|Token interceptado	|Usar HTTPS|
|No se puede invalidar	| Token con expiración corta (8h)|
|Renovación de token	| Implementar refresh token|

## Variables de entorno
```
# .env
JWT_SECRET=tu_secreto_muy_seguro_de_32_caracteres
```

## Estados de la decisión:
- [X] Propuesta
- [X] Analizada
- [X] Aceptada
- [X] Implementada
- [X] Superada

## Referencias

- [JWT.io](https://www.jwt.io/)
- [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519)
- [jsonwebtoken - npm](https://www.npmjs.com/package/jsonwebtoken)