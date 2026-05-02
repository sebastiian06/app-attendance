# App Attendance QR



## Sistema académico para gestión de asistencia mediante QR temporal.



## Tecnologías

\- Ionic React

\- Node.js + Express

\- MongoDB

\- Docker

## Requisitos

- Docker y Docker Compose
- Node.js (solo para desarrollo)

## Instalación y ejecución

### 1. Clonar el repositorio:
```bash
git clone https://github.com/sebastiian06/app-attendance.git
cd app-attendance
```

### 2. Levantar los contenedores:
```
docker-compose up -d
```

### 3. Ejecutar seed (poblar base de datos):
```
docker exec app_attendance_api npm run seed
```

### 4. Acceder a la aplicación:

- Web: http://localhost:8080

- API: http://localhost:4000

--- 

## Credenciales de prueba
```
Documento: DOCENTE-001

Contraseña: demo123
```

## Desarrollo local
### Backend:
```
cd back
npm install
npm run dev
```
### Frontend:
```
cd app
npm install
npm run dev
```

### Estructura
- app/ - Frontend Ionic React

- back/ - Backend Node.js + Express

- docker-compose.yml - Orquestación completa

