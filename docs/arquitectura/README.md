# Arquitectura del Sistema

## Vista General
 
```
┌─────────────────────────────────────────────────────────────────┐
│                           CLIENTES                              │
│  ┌─────────────────┐  ┌───────────────────┐  ┌───────────────┐  │
│  │   Web Browser   │  │ Android (Capacitor│  │ Postman / cURL│  │
│  │  (Ionic React)  │  │                   │  │               │  │
│  └────────┬────────┘  └────────┬──────────┘  └───────┬───────┘  │
└───────────┼────────────────────┼─────────────────────┼──────────┘
            │                    │                     │
            ▼                    ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (Express)                      │
│                                                                 │
│  ┌──────────────┐   ┌──────────────────┐   ┌─────────────────┐  │
│  │  Auth (JWT)  │   │    Sessions      │   │ Public Routes   │  │
│  │  - login     │   │    - create      │   │      (QR)       │  │
│  │  - logout    │   │    - activate    │   │ - register      │  │
│  └──────────────┘   └──────────────────┘   │   attendance    │  │
│                                            └─────────────────┘  │
│              ┌──────────────────┐   ┌──────────────────┐        │
│              │  Institutions    │   │    Students      │        │
│              │  - list          │   │  - list by unit  │        │
│              │  - units         │   │                  │        │
│              └──────────────────┘   └──────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MONGODB (Docker)                         │
│                                                                 │
│  ┌─────────────┐  ┌───────────────┐  ┌────────┐  ┌──────────┐   │
│  │ Institution │  │ AcademicUnit  │  │ Person │  │Enrollment│   │
│  └─────────────┘  └───────────────┘  └────────┘  └──────────┘   │
│                                                                 │
│           ┌───────────────┐   ┌──────────────────┐              │
│           │    Session    │   │    Attendance     │             │
│           └───────────────┘   └──────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```
 
---
 
## Descripción de Capas
 
### 1. Clientes
| Cliente | Tecnología |
|--------|-----------|
| Web Browser | Ionic React |
| Aplicación Móvil | Android con Capacitor |
| Pruebas / API | Postman / cURL |
 
### 2. API Gateway (Express)
 
#### Autenticación
| Ruta | Descripción |
|------|-------------|
| `POST /auth/login` | Inicio de sesión con JWT |
| `POST /auth/logout` | Cierre de sesión |
 
#### Sesiones
| Ruta | Descripción |
|------|-------------|
| `POST /sessions/create` | Crear nueva sesión |
| `PUT /sessions/activate` | Activar una sesión |
 
#### Rutas Públicas (QR)
| Ruta | Descripción |
|------|-------------|
| `POST /attendance/register` | Registrar asistencia mediante QR |
 
#### Instituciones
| Ruta | Descripción |
|------|-------------|
| `GET /institutions/list` | Listar instituciones |
| `GET /institutions/units` | Listar unidades académicas |
 
#### Estudiantes
| Ruta | Descripción |
|------|-------------|
| `GET /students/list` | Listar estudiantes por unidad |
 
---
 
### 3. Base de Datos — MongoDB (Docker)
 
| Colección | Descripción |
|-----------|-------------|
| `Institution` | Datos de instituciones |
| `AcademicUnit` | Unidades académicas por institución |
| `Person` | Información de personas (estudiantes / docentes) |
| `Enrollment` | Matrículas o inscripciones |
| `Session` | Sesiones de clase |
| `Attendance` | Registros de asistencia |



## Tecnologías utilizadas

| Capa | Tecnología | Versión | Propósito |
|------|------------|---------|-----------|
| **Frontend** | Ionic React | 7.8.6 | UI componentes |
| | React | 18.2.0 | Framework UI |
| | Vite | 4.4.0 | Build tool |
| | Capacitor | 5.7.8 | Build nativo para Android |
| | qrcode.react | 3.2.0 | Generación de códigos QR |
| **Backend** | Node.js | 18.x | Runtime |
| | Express | 4.18.x | Framework API |
| | TypeScript | 5.0.0 | Tipado estático |
| | Mongoose | 7.x | ODM para MongoDB |
| | JWT | 9.x | Autenticación |
| **Base de Datos** | MongoDB | 7 | Base de datos NoSQL |
| **Orquestación** | Docker | 24.x | Contenedores |
| | Docker Compose | 2.x | Multi-contenedor |

## Capas del Sistema

### 1. Frontend (Ionic React)
- **Ubicación**: `app/`
- **Puerto desarrollo**: 5173
- **Puerto Docker**: 8080
- **Responsabilidades**:
  - Interfaz de usuario para docente
  - Gestión de estado (localStorage)
  - Generación y visualización de QR
  - Registro de asistencia vía QR (público)
  - Visualización de resultados

### 2. Backend (Node.js + Express)
- **Ubicación**: `back/`
- **Puerto**: 4000
- **Responsabilidades**:
  - API REST para frontend
  - Autenticación JWT
  - Lógica de negocio
  - Persistencia en MongoDB
  - Validación de datos

### 3. Base de Datos (MongoDB)
- **Puerto**: 27017
- **Responsabilidades**:
  - Almacenamiento de instituciones
  - Almacenamiento de unidades académicas
  - Almacenamiento de personas (docentes/estudiantes)
  - Almacenamiento de sesiones y asistencias

### 4. Orquestación (Docker Compose)
- **Responsabilidades**:
  - Levantar todos los servicios con un comando
  - Red interna entre contenedores
  - Volúmenes para persistencia de datos

## Flujo de Datos Principal

### 1. Autenticación del Docente
Docente → Login → Backend valida credenciales → Genera JWT → Frontend guarda token

### 2. Selección de Institución y Unidad
Frontend (con JWT) → GET /institutions → Backend → MongoDB → Lista instituciones
Frontend → GET /institutions/:id/units → Backend → MongoDB → Lista unidades


### 3. Creación de Sesión QR
Docente selecciona unidad → POST /sessions → Backend crea sesión con qrToken y roomCode
→ Guarda en MongoDB → Retorna QR → Frontend muestra QR

### 4. Registro de Asistencia (Estudiante)
Estudiante escanea QR → POST /public/attendance/:token/register con documento

→ Backend valida:

- Sesión activa y no expirada

- Documento existe y pertenece a la unidad

- No ha registrado antes
→ Registra asistencia → Retorna éxito

### 5. Consulta de Resultados

Docente solicita resultados → GET /sessions/:id/results → Backend calcula:

- Total estudiantes en la unidad

- Presentes (registrados)

- Ausentes (no registrados)

→ Retorna resumen y detalle → Frontend muestra tabla

## Seguridad


| Aspecto | Implementación |
|---------|----------------|
| Autenticación | JWT con expiración (8 horas) |
| Contraseñas | Demo: texto plano (mejorable con bcrypt) |
| Tokens QR | Generación aleatoria única |
| CORS | Configurado para orígenes específicos |
| HTTP | Desarrollo con HTTP (cleartext para Android) |

## Escalabilidad

- **Frontend**: Puede servirse desde CDN
- **Backend**: Stateless, se puede replicar
- **Base de Datos**: MongoDB puede escalar a réplicas

## Limitaciones Conocidas

1. Las contraseñas no están hasheadas (solo para demostración)
2. No hay rate limiting en registro público
3. Sesiones limitadas a 10 minutos por defecto
4. Sin logs centralizados

## Decisiones Técnicas (ADRs)

Ver carpeta [decisiones/](./decisiones/)