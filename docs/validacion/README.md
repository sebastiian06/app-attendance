# Validación - App Attendance

## Guía de validación del sistema

Esta sección contiene toda la documentación para validar que el sistema funciona correctamente.

## Índice

| Documento | Descripción |
|-----------|-------------|
| [Pruebas Manuales](./pruebas-manuales.md) | Casos de prueba paso a paso |
| [Checklist](./checklist.md) | Lista de verificación de validación |
| [SCORM](./scorm.md) | Validación del paquete SCORM para Moodle |

## Criterios de aceptación generales

| Criterio | Descripción |
|----------|-------------|
| ✅ Funcional | Todas las características principales funcionan |
| ✅ Usable | La interfaz es intuitiva y responsive |
| ✅ Portable | Funciona en web y Android |
| ✅ Documentado | La documentación está completa |
| ✅ Reproducible | Se puede instalar en cualquier PC |

## Entornos de prueba

| Entorno | URL | Propósito |
|---------|-----|-----------|
| Desarrollo Local | http://localhost:5173 | Pruebas de desarrollo |
| Docker | http://localhost:8080 | Pruebas de contenedor |
| Android Emulador | http://10.0.2.2:5173 | Pruebas móviles |

## Credenciales de prueba

| Rol | Documento | Contraseña | Institución |
|-----|-----------|------------|-------------|
| Docente | DOCENTE-001 | demo123 | CORHUILA |
| Docente | DOCENTE-002 | demo123 | SENA |
| Estudiante | EST-001 | - | CORHUILA |
| Estudiante | APR-001 | - | SENA |

## Herramientas recomendadas para pruebas

| Herramienta | Uso |
|-------------|-----|
| Postman / Insomnia | Probar endpoints de API |
| MongoDB Compass | Visualizar base de datos |
| Chrome DevTools | Debug frontend |
| Android Studio | Emular dispositivo |
| Docker Desktop | Gestionar contenedores |