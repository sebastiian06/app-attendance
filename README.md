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

### 2. Configurar variables de entorno:

#### 2.1. Copiar el archivo de ejemplo:
```
# En Windows (PowerShell o CMD)
copy .env.example .env

# En Mac / Linux
cp .env.example .env
```
#### 2.2. Editar el archivo .env (opcional):
Si deseas cambiar puertos o contraseñas, abre el archivo .env con cualquier editor de texto:
```
# En Windows (Notepad)
notepad .env

# En Mac / Linux
nano .env
```
#### 2.3. Configurar el frontend para Android (opcional):
Si vas a ejecutar la app en emulador Android, crea el archivo .env.android:
```
# En Windows
copy .env.example .env.android

# En Mac / Linux
cp .env.example .env.android
```

Luego edita .env.android y cambia:
```
VITE_API_URL=http://10.0.2.2:4000/api
```

### 3. Levantar los contenedores:
```
docker-compose up -d
```
#### 3.1 Verificar que los contenedores están corriendo
```
docker ps
```

Deberías ver 3 contenedores:

- app_attendance_mongo (MongoDB)
- app_attendance_api (Backend Node.js)
- app_attendance_frontend (Frontend)

### 4. Ejecutar seed (poblar base de datos):
```
docker exec app_attendance_api npm run seed
```

### 5. Acceder a la aplicación:

- Aplicación web: http://localhost:8080

- API (backend): http://localhost:4000/health

- Frontend en desarrollo: http://localhost:5173 (si usas npm run dev)

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
cp .env.example .env
npm install
npm run seed
npm run dev
```
### Frontend:
```
cd app
cp .env.example .env
npm install
npm run dev
```
### Android:
```
cd app
cp .env.example .env.android
# Editar .env.android con VITE_API_URL=http://10.0.2.2:4000/api
npm run build
npx cap copy
npx cap sync
npx cap open android
```

### Estructura
- app/ - Frontend Ionic React

- back/ - Backend Node.js + Express

- docker-compose.yml - Orquestación completa

