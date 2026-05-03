# Pruebas Manuales

## Pruebas de Autenticación

### TC-01: Login exitoso

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Abrir http://localhost:5173 | Ver pantalla de login |
| 2 | Ingresar documento: `DOCENTE-001` | Texto en el campo |
| 3 | Ingresar contraseña: `demo123` | Texto en el campo |
| 4 | Click en "Iniciar sesión" | Redirige a selección de institución |

### TC-02: Login fallido

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Abrir pantalla de login | Ver pantalla de login |
| 2 | Ingresar credenciales inválidas | Texto en los campos |
| 3 | Click en "Iniciar sesión" | Mensaje de error |

### TC-03: Credenciales de prueba

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Abrir pantalla de login | Ver pantalla de login |
| 2 | Click en "Usar credenciales de prueba" | Se llenan los campos |
| 3 | Click en "Iniciar sesión" | Redirige correctamente |

---

## Pruebas de Instituciones

### TC-04: Listar instituciones

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Login exitoso | Redirige a instituciones |
| 2 | Ver lista | Debe mostrar CORHUILA y SENA |
| 3 | Ver detalles | Cada tarjeta muestra nombre y código |

### TC-05: Seleccionar institución

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Ver lista de instituciones | Tarjetas visibles |
| 2 | Click en "Universidad Corhuila" | Redirige a unidades |
| 3 | Verificar localStorage | `selectedInstitution` guardada |

---

## Pruebas de Unidades Académicas

### TC-06: Listar unidades (CORHUILA)

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Seleccionar CORHUILA | Redirige a unidades |
| 2 | Ver lista | Debe mostrar materias |
| 3 | Verificar | Matemáticas I, Programación Web, Bases de Datos |

### TC-07: Listar unidades (SENA)

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Seleccionar SENA | Redirige a unidades |
| 2 | Ver lista | Debe mostrar fichas |
| 3 | Verificar | Ficha ADS, Ficha Sistemas |

---

## Pruebas de Estudiantes

### TC-08: Listar estudiantes

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Seleccionar "Matemáticas I" | Redirige a estudiantes |
| 2 | Ver tabla | 5 estudiantes |
| 3 | Ver columnas | #, Nombre, Documento, Matrícula |

### TC-09: Tabla de estudiantes

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Ver tabla | Cabecera verde |
| 2 | Ver filas | Filas alternadas (blanco/gris) |
| 3 | Ver avatares | Iniciales del nombre |

---

## Pruebas de Sesión QR

### TC-10: Crear sesión

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Click en "Crear Sesión con QR" | Redirige a /session |
| 2 | Esperar carga | Muestra QR y código de sala |
| 3 | Ver tiempo | Timer de 10 minutos |

### TC-11: Regenerar QR

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Sesión activa | QR visible |
| 2 | Click en "Regenerar QR" | Nuevo QR y nuevo código |
| 3 | Ver tiempo | Timer reiniciado |

### TC-12: Cerrar sesión

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Sesión activa | Botón "Cerrar Sesión" visible |
| 2 | Click en "Cerrar Sesión" | QR desaparece |
| 3 | Ver mensaje | Opción de crear nueva sesión |

---

## Pruebas de Registro de Asistencia (QR)

### TC-13: Abrir QR

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Crear sesión | QR visible |
| 2 | Abrir en nueva pestaña | URL: /attendance/{token} |
| 3 | Ver pantalla | Formulario de registro |

### TC-14: Registrar asistencia exitosa

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Abrir QR | Formulario visible |
| 2 | Ingresar documento `EST-001` | Texto en campo |
| 3 | Click "Registrar Asistencia" | Mensaje de éxito |

### TC-15: Registrar asistencia duplicada

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Registrar mismo documento | Mensaje de error |
| 2 | Ver mensaje | "Ya registró su asistencia" |

### TC-16: Documento inválido

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Ingresar `INVALIDO-999` | Texto en campo |
| 2 | Click registrar | Mensaje "Documento no válido" |

### TC-17: Sesión expirada

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Esperar 10 minutos | QR inválido |
| 2 | Intentar registrar | Mensaje "Sesión expirada" |

---

## Pruebas de Resultados

### TC-18: Ver resultados

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Tener asistencias registradas | Datos en BD |
| 2 | Click "Ver Resultados" | Redirige a /results |
| 3 | Ver resumen | Tarjetas con total, presentes, ausentes |

### TC-19: Filtrar por presentes

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | En resultados | Ver todos los estudiantes |
| 2 | Click "Presentes" | Solo muestra presentes |
| 3 | Ver tabla | Columna "Presente" con hora |

### TC-20: Filtrar por ausentes

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | En resultados | Ver todos los estudiantes |
| 2 | Click "Ausentes" | Solo muestra ausentes |
| 3 | Ver tabla | Columna "Ausente" |

### TC-21: Exportar a CSV

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | En resultados | Botón de descarga visible |
| 2 | Click en descargar | Se descarga archivo .csv |
| 3 | Abrir archivo | Datos correctos |

---

## Pruebas de Android (Emulador)

### TC-22: Conexión al backend

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Iniciar emulador | App abierta |
| 2 | Verificar conexión | Login visible |
| 3 | Probar login | Debe funcionar con 10.0.2.2 |

### TC-23: Flujo completo en Android

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | Login | Redirige a instituciones |
| 2 | Seleccionar institución | Redirige a unidades |
| 3 | Seleccionar unidad | Redirige a estudiantes |
| 4 | Crear sesión QR | QR visible |
| 5 | Registrar asistencia | Éxito |

---

## Pruebas de Docker

### TC-24: Levantar servicios

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | `docker-compose up -d` | 3 contenedores corriendo |
| 2 | `docker-compose ps` | Estado "Up" |
| 3 | Acceder a http://localhost:8080 | App visible |

### TC-25: Ejecutar seed

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | `docker exec app_attendance_api npm run seed` | Mensaje de éxito |
| 2 | Verificar datos | Login funciona |

### TC-26: Reconstruir después de cambios

| Paso | Acción | Resultado Esperado |
|------|--------|-------------------|
| 1 | `docker-compose up -d --build` | Reconstruye imágenes |
| 2 | Verificar | App funcionando |