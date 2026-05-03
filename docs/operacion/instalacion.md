# Instalación Local (sin Docker)

## Prerrequisitos

- Node.js 18.x o superior
- MongoDB 7.x instalado localmente
- Git

## Pasos de instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/app-attendance.git
cd app-attendance
```

### 2. Configurar variables de entorno

#### Backend
```
cd back
cp .env.example .env
```
**Editar .env:**
```
API_PORT=4000
MONGO_URI=mongodb://localhost:27017/app_attendance
JWT_SECRET=tu_secreto_seguro
```

### Frontend
```
cd app
cp .env.example .env
```
**Editar .env:**
```
VITE_API_URL=http://localhost:4000/api
```

### 3. Instalar dependencias

#### Backend
```
cd back
npm install
```
#### Frontend
```
cd app
npm install
```

### 4. Iniciar MongoDB
```
# En Windows (si está instalado como servicio)
net start MongoDB

# En Mac/Linux
sudo systemctl start mongod

# O usando Docker
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### 5. Ejecutar seed (poblar base de datos)
```
cd back
npm run seed
```

### 6. Iniciar la aplicación
#### Backend (Terminal 1)
```
cd back
npm run dev
```
#### Frontend (Terminal 2)
```
cd app
npm run dev
```

### 7. Acceder a la aplicación

- Frontend: http://localhost:5173

- Backend API: http://localhost:4000

- Health check: http://localhost:4000/health

### 8. Credenciales de prueba

|Documento | Contraseña|
|----------|-----------|
|DOCENTE-001 | demo123 |
|DOCENTE-002 | demo123 |

## Solución de problemas

### Solución de problemas
```
# Verificar que MongoDB está corriendo
mongod --version

# Verificar el puerto
netstat -an | findstr 27017
```

### Error: Puerto 4000 ya está en uso
```
# Cambiar el puerto en .env
API_PORT=4001
```

### Error: TypeScript no encontrado
```
npm install -g typescript ts-node
```

## Desinstalación
```
# Eliminar dependencias
cd back && rm -rf node_modules
cd ../app && rm -rf node_modules

# Eliminar base de datos (si aplica)
mongo app_attendance --eval "db.dropDatabase()"
```
