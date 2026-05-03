# Seed de Datos - Poblar la Base de Datos

## Descripción

El seed es un script que llena la base de datos con datos de prueba para poder utilizar la aplicación inmediatamente después de instalarla.

## ¿Qué datos incluye el seed?

| Tipo de dato | Cantidad | Detalle |
|--------------|----------|---------|
| Instituciones | 2 | CORHUILA, SENA |
| Unidades académicas | 5 | 3 materias CORHUILA, 2 fichas SENA |
| Estudiantes | 10 | 5 CORHUILA, 5 SENA |
| Docentes | 2 | 1 CORHUILA, 1 SENA |
| Matrículas | 19 | Relaciones estudiante-unidad |

## Ejecutar el seed

### Con Docker

```bash
docker exec app_attendance_api npm run seed
```

### Sin Docker (desarrollo local)
```bash
cd back
npm run seed
```

### Salida esperada
```text
✅ Conectado a MongoDB
✅ Datos anteriores eliminados
✅ Instituciones creadas: Universidad Corhuila SENA
✅ Unidades académicas creadas
✅ Estudiantes CORHUILA creados: 5
✅ Estudiantes SENA creados: 5
✅ Docentes creados
✅ Matrículas creadas

🎉 SEED COMPLETADO EXITOSAMENTE 🎉

📊 RESUMEN:
   - Instituciones: 2
   - Unidades académicas: 5
   - Estudiantes: 10
   - Docentes: 2
   - Matrículas: 19

🔑 CREDENCIALES DE PRUEBA:
   📚 CORHUILA:
      - Matemáticas I: 5 estudiantes
      - Programación Web: 3 estudiantes
      - Bases de Datos: 3 estudiantes
   🎓 SENA:
      - Ficha ADS: 5 estudiantes
      - Ficha Sistemas: 3 estudiantes

👨‍🏫 LOGIN DOCENTES:
   - Documento: DOCENTE-001, Contraseña: demo123 (CORHUILA)
   - Documento: DOCENTE-002, Contraseña: demo123 (SENA)
```

### Datos creados en detalle
#### Instituciones
|Código	|Nombre	|Tipo|
|-------|-------|----|
|CORHUILA	|Universidad Corhuila	|university|
|SENA	|SENA	|technical|

#### Unidades Académicas (CORHUILA)
|Código	|Nombre	|Tipo	|Estudiantes|
|-------|-------|-------|-----------|
|MAT-101	|Matemáticas I	|materia	|5|
|PROG-201	|Programación Web	|materia	|3|
|BD-301	|Bases de Datos	|materia	|3|

#### Unidades Académicas (SENA)
|Código	|Nombre	|Tipo	|Estudiantes|
|-------|-------|-------|-----------|
|FICHA-123	|Tecnólogo en Análisis y Desarrollo de Software	|ficha	|5|
|FICHA-456	|Técnico en Sistemas	|ficha	|3|

#### Estudiantes CORHUILA
|Documento	|Nombre	|Matrícula|
|-----------|-------|---------|
|EST-001	|Ana María Rodríguez	|2024001|
|EST-002	|Carlos Andrés Pérez	|2024002|
|EST-003	|Laura Sofía Gómez	|2024003|
|EST-004	|Miguel Ángel Torres	|2024004|
|EST-005	|Valentina López	|2024005|

#### Estudiantes SENA
|Documento	|Nombre	|Matrícula|
|-----------|-------|---------|
|APR-001	|Juan David Martínez	|ADS-123-001|
|APR-002	|María José Ramírez	|ADS-123-002|
|APR-003	|Santiago Castro	|ADS-123-003|
|APR-004	|Isabella Rojas	|ADS-123-004|
|APR-005	|Nicolás Díaz	|ADS-123-005|

#### Docentes
|Documento	|Nombre	|Institución|
|-----------|-------|-----------|
|DOCENTE-001	|Profesor Juan Pérez	|CORHUILA|
|DOCENTE-002	|Instructora María Gómez	|SENA|

### Código del seed
```typescript
// back/src/scripts/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/app_attendance';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Importar modelos
    const Institution = (await import('../models/institution.model')).default;
    const AcademicUnit = (await import('../models/academicUnit.model')).default;
    const Person = (await import('../models/person.model')).default;
    const Enrollment = (await import('../models/enrollment.model')).default;

    // Limpiar datos existentes
    await Institution.deleteMany({});
    await AcademicUnit.deleteMany({});
    await Person.deleteMany({});
    await Enrollment.deleteMany({});
    console.log('✅ Datos anteriores eliminados');

    // Crear instituciones
    const corhuila = await Institution.create({
      code: 'CORHUILA',
      name: 'Universidad Corhuila',
      context: 'university',
      labels: ['pregrado', 'posgrado'],
      active: true
    });

    const sena = await Institution.create({
      code: 'SENA',
      name: 'SENA',
      context: 'technical',
      labels: ['tecnólogo', 'técnico'],
      active: true
    });

    // ... resto del código del seed
}
```

### Volver a ejecutar el seed
El seed elimina todos los datos existentes antes de crear los nuevos. Esto es útil para:

1. Reiniciar la base de datos a su estado inicial

2. Probar la aplicación con datos limpios

3. Corregir datos corruptos

### Verificar que el seed funcionó
```bash
# Conectar a MongoDB y contar documentos
docker exec -it app_attendance_mongo mongosh -u admin -p admin123

# En la consola de MongoDB:
use app_attendance
db.institutions.countDocuments()  # Debe mostrar 2
db.people.countDocuments()        # Debe mostrar 12 (10 estudiantes + 2 docentes)
```

### Solución de problemas
**Error: No se puede conectar a MongoDB**
```bash
# Verificar que MongoDB está corriendo
docker ps | grep mongo

# Si no está, levantar servicios
docker-compose up -d
```
**Error: Modelo no encontrado**
```bash
# Reconstruir el backend
docker-compose up -d --build api
```
**El seed se ejecuta pero no hay datos**
```bash
# Verificar logs del seed
docker logs app_attendance_api

# Ejecutar seed nuevamente
docker exec app_attendance_api npm run seed
```