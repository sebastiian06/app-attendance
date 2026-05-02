// back/src/scripts/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Institution from './models/institution.model';
import AcademicUnit from './models/academicUnit.model';
import Person from './models/person.model';
import Enrollment from './models/enrollment.model';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/app_attendance');
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await Institution.deleteMany({});
    await AcademicUnit.deleteMany({});
    await Person.deleteMany({});
    await Enrollment.deleteMany({});
    console.log('✅ Datos anteriores eliminados');

    // 1. Crear instituciones
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

    console.log('✅ Instituciones creadas');

    // 2. Crear unidades académicas (materias/fichas)
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

    const fichaSoftware = await AcademicUnit.create({
      institutionId: sena._id,
      code: 'FICHA-123',
      name: 'Tecnólogo en Análisis y Desarrollo de Software',
      type: 'ficha',
      active: true
    });

    console.log('✅ Unidades académicas creadas');

    // 3. Crear personas (estudiantes)
    const estudiantes = await Person.create([
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
        institutionId: sena._id,
        documento: 'APR-001',
        nombre: 'Juan David Martínez',
        matricula: 'ADS-123-001',
        roles: ['student']
      },
      {
        institutionId: sena._id,
        documento: 'APR-002',
        nombre: 'Valentina López',
        matricula: 'ADS-123-002',
        roles: ['student']
      }
    ]);

    console.log('✅ Estudiantes creados');

    // 4. Matricular estudiantes en unidades académicas
    await Enrollment.create([
      { institutionId: corhuila._id, unitId: matematicas._id, personId: estudiantes[0]._id, active: true },
      { institutionId: corhuila._id, unitId: matematicas._id, personId: estudiantes[1]._id, active: true },
      { institutionId: corhuila._id, unitId: programacion._id, personId: estudiantes[1]._id, active: true },
      { institutionId: corhuila._id, unitId: programacion._id, personId: estudiantes[2]._id, active: true },
      { institutionId: sena._id, unitId: fichaSoftware._id, personId: estudiantes[3]._id, active: true },
      { institutionId: sena._id, unitId: fichaSoftware._id, personId: estudiantes[4]._id, active: true }
    ]);

    console.log('✅ Matrículas creadas');
    console.log('🎉 Seed completado exitosamente');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seedDatabase();