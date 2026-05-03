# Checklist de Validación

## ✅ Validación del Backend

### Configuración y entorno

- [ ] `npm install` instala todas las dependencias sin errores
- [ ] `npm run dev` inicia el servidor sin errores
- [ ] Servidor corre en el puerto 4000
- [ ] `GET /health` responde con `{"status":"OK"}`

### Base de datos

- [ ] MongoDB está corriendo (local o Docker)
- [ ] `npm run seed` ejecuta sin errores
- [ ] Seed crea 2 instituciones (CORHUILA, SENA)
- [ ] Seed crea 5 unidades académicas
- [ ] Seed crea 10 estudiantes
- [ ] Seed crea 2 docentes
- [ ] Seed crea 19 matrículas

### Endpoints de autenticación

- [ ] `POST /api/auth/login` con credenciales correctas retorna token
- [ ] `POST /api/auth/login` con credenciales incorrectas retorna 401
- [ ] Token JWT expira después de 8 horas

### Endpoints de instituciones (requieren auth)

- [ ] `GET /api/institutions` retorna lista de instituciones
- [ ] `GET /api/institutions/:id/units` retorna unidades de CORHUILA
- [ ] `GET /api/institutions/:id/units` retorna fichas de SENA
- [ ] `GET /api/units/:id/students` retorna estudiantes de Matemáticas I (5)
- [ ] `GET /api/units/:id/students` retorna estudiantes de Ficha ADS (5)

### Endpoints de sesiones (requieren auth)

- [ ] `POST /api/sessions` crea sesión con qrToken único
- [ ] `POST /api/sessions` genera roomCode de 6 dígitos
- [ ] `POST /api/sessions/:id/activate` activa la sesión
- [ ] `POST /api/sessions` con misma unidad retorna 409 (conflicto)
- [ ] `GET /api/sessions/:id/results` retorna resumen de asistencia

### Endpoints públicos (QR)

- [ ] `POST /api/public/attendance/:token/register` con documento válido retorna éxito
- [ ] Registro duplicado retorna 409
- [ ] Documento inválido retorna 404
- [ ] Sesión expirada retorna 400
- [ ] Token inválido retorna 404

---

## ✅ Validación del Frontend (Web)

### Pantalla de Login

- [ ] La pantalla se ve centrada
- [ ] Campos de documento y contraseña son visibles
- [ ] Botón "Iniciar sesión" es verde
- [ ] Botón "Usar credenciales de prueba" funciona
- [ ] Login exitoso redirige a instituciones

### Pantalla de Instituciones

- [ ] Se muestran CORHUILA y SENA como tarjetas
- [ ] Cada tarjeta tiene ícono, nombre y código
- [ ] Click en CORHUILA redirige a unidades
- [ ] Click en SENA redirige a fichas

### Pantalla de Unidades Académicas

- [ ] Título dinámico ("Materias" o "Fichas")
- [ ] Se muestra el nombre de la institución seleccionada
- [ ] Las tarjetas tienen tamaño uniforme
- [ ] Click en Matemáticas I redirige a estudiantes

### Pantalla de Estudiantes

- [ ] Tabla con cabecera verde (#, Nombre, Documento, Matrícula)
- [ ] Filas alternadas (blanco/gris claro)
- [ ] Avatares con iniciales del nombre
- [ ] Botón "Crear Sesión con QR" centrado y grande
- [ ] Botón deshabilitado si no hay estudiantes

### Pantalla de Sesión QR

- [ ] Se genera QR al crear sesión
- [ ] Se muestra código de sala (6 dígitos)
- [ ] Timer cuenta regresiva (10 minutos)
- [ ] Botones: "Cerrar Sesión" (rojo), "Regenerar QR" (naranja), "Ver Resultados" (azul)
- [ ] Botones están centrados uno al lado del otro

### Pantalla de Registro Público (QR)

- [ ] URL `/attendance/{token}` abre el formulario
- [ ] Campo para ingresar documento
- [ ] Botón "Registrar Asistencia" verde
- [ ] Mensaje de éxito con nombre del estudiante
- [ ] Mensajes de error apropiados
- [ ] Botón "Registrar otra asistencia"

### Pantalla de Resultados

- [ ] Tarjetas de resumen (Total, Presentes, Ausentes, %)
- [ ] Segmento para filtrar (Todos, Presentes, Ausentes)
- [ ] Tabla con #, Nombre, Documento, Matrícula, Estado
- [ ] Botones de exportar CSV e imprimir
- [ ] Botón flotante para nueva sesión

---

## ✅ Validación Android

### Configuración

- [ ] `npm run build` sin errores
- [ ] `npx cap copy` copia archivos
- [ ] `npx cap sync` sincroniza
- [ ] `npx cap open android` abre Android Studio

### Emulador

- [ ] App se instala en el emulador
- [ ] App se abre sin errores
- [ ] Conexión con backend usando `10.0.2.2`
- [ ] Login funciona
- [ ] Flujo completo funciona
- [ ] QR se genera y se puede escanear

### AndroidManifest.xml

- [ ] `android:usesCleartextTraffic="true"` está presente
- [ ] Permiso de Internet está presente

---

## ✅ Validación Docker

### Levantar servicios

- [ ] `docker-compose up -d` funciona
- [ ] Los 3 contenedores están corriendo (`docker-compose ps`)
- [ ] `docker exec app_attendance_api npm run seed` funciona
- [ ] http://localhost:8080 abre la app
- [ ] http://localhost:4000/health responde 200
- [ ] Login funciona con Docker

### Limpieza

- [ ] `docker-compose down` detiene servicios
- [ ] `docker-compose down -v` elimina volúmenes

---

## ✅ Validación SCORM (para Moodle)

### Estructura del paquete

- [ ] Carpeta SCORM contiene `imsmanifest.xml`
- [ ] `index.html` existe
- [ ] `css/styles.css` existe
- [ ] `js/scorm.js` existe
- [ ] Archivos están comprimidos en ZIP

### Validación del ZIP

```bash
unzip -t app-attendance-scorm-moodle.zip
# Debe mostrar: No errors detected in compressed data
```
## Importación en Moodle
- El ZIP se importa sin errores

- El paquete se puede visualizar

- El progreso se registra correctamente

## ✅ Validación de Documentación

### Archivos de documentación creados
- docs/README.md

- docs/arquitectura/README.md

- docs/arquitectura/decisiones/001-monorepo-estructura.md

- docs/arquitectura/decisiones/002-docker-compose.md

- docs/arquitectura/decisiones/003-jwt-autenticacion.md

- docs/arquitectura/decisiones/004-mongodb-modelos.md

- docs/api/README.md

- docs/api/auth.md

- docs/api/institutions.md

- docs/api/sessions.md

- docs/api/attendance.md

- docs/api/errores.md

- docs/modelo-datos/README.md

- docs/modelo-datos/institution.md

- docs/modelo-datos/academic-unit.md

- docs/modelo-datos/person.md

- docs/modelo-datos/enrollment.md

- docs/modelo-datos/session.md

- docs/modelo-datos/attendance.md

- docs/operacion/README.md

- docs/operacion/instalacion.md

- docs/operacion/docker.md

- docs/operacion/seed.md

- docs/operacion/despliegue.md

- docs/validacion/README.md

- docs/validacion/pruebas-manuales.md

- docs/validacion/checklist.md

- docs/validacion/scorm.md

## ✅ Validación de Código Fuente
### Backend
- No hay console.logs en código de producción

- Tipos TypeScript correctos

- Manejo de errores con try-catch

- Variables de entorno validadas

### Frontend
- No hay errores de TypeScript

- npm run build sin errores

- Componentes funcionales

- Estilos responsive

## ✅ Validación de Seguridad Básica
- JWT secret no está hardcodeado (usa .env)

- Contraseñas no están en texto plano (demo, pero advertido)

- CORS restringido en producción

- No hay información sensible en el repositorio

## Resumen de validación
|Área	|Estado	|Observaciones|
|-------|-------|-------------|
|Backend	|⬜ Pendiente|	
|Frontend Web	|⬜ Pendiente|	
|Android	|⬜ Pendiente|	
|Docker	|⬜ Pendiente|	
|SCORM	|⬜ Pendiente|	
|Documentación	|⬜ Pendiente|

**Fecha de validación: _____________**

**Responsable: _____________**

**Firma: _____________**