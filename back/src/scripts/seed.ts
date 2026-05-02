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
    
    // ============================================
    // 1. CREAR INSTITUCIONES
    // ============================================
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
    
    console.log('✅ Instituciones creadas:', corhuila.name, sena.name);
    
    // ============================================
    // 2. CREAR UNIDADES ACADÉMICAS
    // ============================================
    const matematicas = await AcademicUnit.create({
      institutionId: corhuila._id,
      code: 'MAT-101',
      name: 'Matemáticas I',
      type: 'materia',
      active: true
    });
    
    const programacion = await AcademicUnit.create({
      institutionId: corhuila._id,
      code: 'PROG-201',
      name: 'Programación Web',
      type: 'materia',
      active: true
    });
    
    const basesDatos = await AcademicUnit.create({
      institutionId: corhuila._id,
      code: 'BD-301',
      name: 'Bases de Datos',
      type: 'materia',
      active: true
    });
    
    const fichaSoftware = await AcademicUnit.create({
      institutionId: sena._id,
      code: 'FICHA-123',
      name: 'Tecnólogo en Análisis y Desarrollo de Software',
      type: 'ficha',
      active: true
    });
    
    const fichaSistemas = await AcademicUnit.create({
      institutionId: sena._id,
      code: 'FICHA-456',
      name: 'Técnico en Sistemas',
      type: 'ficha',
      active: true
    });
    
    console.log('✅ Unidades académicas creadas');
    
    // ============================================
    // 3. CREAR ESTUDIANTES CORHUILA
    // ============================================
    const estudiantesCorhuila = await Person.create([
      {
        institutionId: corhuila._id,
        documento: 'EST-001',
        nombre: 'Ana María Rodríguez',
        matricula: '2024001',
        roles: ['student']
      },
      {
        institutionId: corhuila._id,
        documento: 'EST-002',
        nombre: 'Carlos Andrés Pérez',
        matricula: '2024002',
        roles: ['student']
      },
      {
        institutionId: corhuila._id,
        documento: 'EST-003',
        nombre: 'Laura Sofía Gómez',
        matricula: '2024003',
        roles: ['student']
      },
      {
        institutionId: corhuila._id,
        documento: 'EST-004',
        nombre: 'Miguel Ángel Torres',
        matricula: '2024004',
        roles: ['student']
      },
      {
        institutionId: corhuila._id,
        documento: 'EST-005',
        nombre: 'Valentina López',
        matricula: '2024005',
        roles: ['student']
      }
    ]);
    
    console.log('✅ Estudiantes CORHUILA creados:', estudiantesCorhuila.length);
    
    // ============================================
    // 4. CREAR ESTUDIANTES SENA
    // ============================================
    const estudiantesSena = await Person.create([
      {
        institutionId: sena._id,
        documento: 'APR-001',
        nombre: 'Juan David Martínez',
        matricula: 'ADS-123-001',
        roles: ['student']
      },
      {
        institutionId: sena._id,
        documento: 'APR-002',
        nombre: 'María José Ramírez',
        matricula: 'ADS-123-002',
        roles: ['student']
      },
      {
        institutionId: sena._id,
        documento: 'APR-003',
        nombre: 'Santiago Castro',
        matricula: 'ADS-123-003',
        roles: ['student']
      },
      {
        institutionId: sena._id,
        documento: 'APR-004',
        nombre: 'Isabella Rojas',
        matricula: 'ADS-123-004',
        roles: ['student']
      },
      {
        institutionId: sena._id,
        documento: 'APR-005',
        nombre: 'Nicolás Díaz',
        matricula: 'ADS-123-005',
        roles: ['student']
      }
    ]);
    
    console.log('✅ Estudiantes SENA creados:', estudiantesSena.length);
    
    // ============================================
    // 5. CREAR DOCENTES
    // ============================================
    await Person.create([
      {
        institutionId: corhuila._id,
        documento: 'DOCENTE-001',
        nombre: 'Profesor Juan Pérez',
        roles: ['teacher']  // ✅ Corregido: solo 'roles'
      },
      {
        institutionId: sena._id,
        documento: 'DOCENTE-002',
        nombre: 'Instructora María Gómez',
        roles: ['teacher']  // ✅ Corregido: solo 'roles'
      }
    ]);
    
    console.log('✅ Docentes creados');
    
    // ============================================
    // 6. MATRICULAR ESTUDIANTES
    // ============================================
    
    // Matricular todos los estudiantes de CORHUILA en Matemáticas
    for (const estudiante of estudiantesCorhuila) {
      await Enrollment.create({
        institutionId: corhuila._id,
        unitId: matematicas._id,
        personId: estudiante._id,
        active: true
      });
    }
    
    // Matricular algunos estudiantes de CORHUILA en Programación
    await Enrollment.create([
      {
        institutionId: corhuila._id,
        unitId: programacion._id,
        personId: estudiantesCorhuila[0]._id,
        active: true
      },
      {
        institutionId: corhuila._id,
        unitId: programacion._id,
        personId: estudiantesCorhuila[1]._id,
        active: true
      },
      {
        institutionId: corhuila._id,
        unitId: programacion._id,
        personId: estudiantesCorhuila[2]._id,
        active: true
      }
    ]);
    
    // Matricular algunos estudiantes de CORHUILA en Bases de Datos
    await Enrollment.create([
      {
        institutionId: corhuila._id,
        unitId: basesDatos._id,
        personId: estudiantesCorhuila[1]._id,
        active: true
      },
      {
        institutionId: corhuila._id,
        unitId: basesDatos._id,
        personId: estudiantesCorhuila[3]._id,
        active: true
      },
      {
        institutionId: corhuila._id,
        unitId: basesDatos._id,
        personId: estudiantesCorhuila[4]._id,
        active: true
      }
    ]);
    
    // Matricular todos los estudiantes de SENA en Ficha Software
    for (const estudiante of estudiantesSena) {
      await Enrollment.create({
        institutionId: sena._id,
        unitId: fichaSoftware._id,
        personId: estudiante._id,
        active: true
      });
    }
    
    // Matricular algunos estudiantes de SENA en Ficha Sistemas
    await Enrollment.create([
      {
        institutionId: sena._id,
        unitId: fichaSistemas._id,
        personId: estudiantesSena[0]._id,
        active: true
      },
      {
        institutionId: sena._id,
        unitId: fichaSistemas._id,
        personId: estudiantesSena[2]._id,
        active: true
      },
      {
        institutionId: sena._id,
        unitId: fichaSistemas._id,
        personId: estudiantesSena[4]._id,
        active: true
      }
    ]);
    
    console.log('✅ Matrículas creadas');
    
    // ============================================
    // 7. RESUMEN FINAL
    // ============================================
    console.log('\n🎉 SEED COMPLETADO EXITOSAMENTE 🎉');
    console.log('\n📊 RESUMEN:');
    console.log(`   - Instituciones: 2`);
    console.log(`   - Unidades académicas: 5`);
    console.log(`   - Estudiantes: ${estudiantesCorhuila.length + estudiantesSena.length}`);
    console.log(`   - Docentes: 2`);
    console.log(`   - Matrículas: ${await Enrollment.countDocuments()}`);
    console.log('\n🔑 CREDENCIALES DE PRUEBA:');
    console.log('   📚 CORHUILA:');
    console.log('      - Matemáticas I: 5 estudiantes');
    console.log('      - Programación Web: 3 estudiantes');
    console.log('      - Bases de Datos: 3 estudiantes');
    console.log('   🎓 SENA:');
    console.log('      - Ficha ADS: 5 estudiantes');
    console.log('      - Ficha Sistemas: 3 estudiantes');
    console.log('\n👨‍🏫 LOGIN DOCENTES:');
    console.log('   - Documento: DOCENTE-001, Contraseña: demo123 (CORHUILA)');
    console.log('   - Documento: DOCENTE-002, Contraseña: demo123 (SENA)');
    
    await mongoose.disconnect();
    console.log('\n✅ Desconectado de MongoDB');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seedDatabase();