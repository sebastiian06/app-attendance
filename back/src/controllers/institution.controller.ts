// back/src/controllers/institution.controller.ts
import { Request, Response } from 'express';
import Institution from '../models/institution.model';
import AcademicUnit from '../models/academicUnit.model';
import Enrollment from '../models/enrollment.model';
import Person from '../models/person.model';

export const getInstitutions = async (req: Request, res: Response) => {
  try {
    console.log('📡 Obteniendo instituciones...');
    
    const institutions = await Institution.find({ active: true });
    
    console.log(`✅ Encontradas ${institutions.length} instituciones`);
    res.json(institutions);
    
  } catch (error) {
    console.error('❌ Error en getInstitutions:', error);
    res.status(500).json({ error: 'Error fetching institutions' });
  }
};

export const getAcademicUnitsByInstitution = async (req: Request, res: Response) => {
  try {
    const { institutionId } = req.params;
    
    console.log(`📡 Obteniendo unidades para institución: ${institutionId}`);
    
    const units = await AcademicUnit.find({ 
      institutionId: institutionId, 
      active: true 
    }).populate('institutionId', 'name code');
    
    console.log(`✅ Encontradas ${units.length} unidades`);
    res.json(units);
    
  } catch (error) {
    console.error('❌ Error en getAcademicUnitsByInstitution:', error);
    res.status(500).json({ error: 'Error fetching academic units' });
  }
};

// back/src/controllers/institution.controller.ts
export const getStudentsByUnit = async (req: Request, res: Response) => {
  try {
    const { unitId } = req.params;
    
    console.log(`📡 [1] Obteniendo estudiantes para unidad: ${unitId}`);
    
    // Verificar si la unidad existe
    const unitExists = await AcademicUnit.findById(unitId);
    console.log(`📡 [2] Unidad existe:`, unitExists ? unitExists.name : 'NO ENCONTRADA');
    
    if (!unitExists) {
      return res.status(404).json({ error: 'Unidad no encontrada' });
    }
    
    // Buscar todas las matrículas
    const enrollments = await Enrollment.find({ 
      unitId: unitId, 
      active: true 
    }).populate('personId');
    
    console.log(`📡 [3] Matrículas encontradas: ${enrollments.length}`);
    
    if (enrollments.length > 0) {
      console.log('📡 [4] Primera matrícula:', JSON.stringify(enrollments[0], null, 2));
    }
    
    // Extraer los estudiantes
    const students = [];
    
    for (let i = 0; i < enrollments.length; i++) {
      const enrollment: any = enrollments[i];
      const person = enrollment.personId;
      
      console.log(`📡 [5] Matrícula ${i}: personId=${person?._id}, nombre=${person?.nombre}`);
      
      if (person) {
        students.push({
          _id: person._id,
          documento: person.documento,
          nombre: person.nombre,
          matricula: person.matricula || '',
          roles: person.roles || []
        });
      }
    }
    
    console.log(`📡 [6] Estudiantes procesados: ${students.length}`);
    
    if (students.length === 0) {
      return res.status(404).json({ 
        error: 'No hay estudiantes inscritos en esta unidad',
        students: [],
        debug: {
          unitId,
          unitName: unitExists.name,
          enrollmentsCount: enrollments.length
        }
      });
    }
    
    res.json(students);
    
  } catch (error) {
    console.error('❌ Error en getStudentsByUnit:', error);
    res.status(500).json({ 
      error: 'Error fetching students',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const debugInstitutionData = async (req: Request, res: Response) => {
  try {
    const institutions = await Institution.find({});
    const academicUnits = await AcademicUnit.find({});
    const persons = await Person.find({});
    const enrollments = await Enrollment.find({});
    
    res.json({
      institutions: { count: institutions.length, data: institutions },
      academicUnits: { count: academicUnits.length, data: academicUnits },
      persons: { count: persons.length, data: persons },
      enrollments: { count: enrollments.length, data: enrollments }
    });
  } catch (error) {
    console.error('Error en debug:', error);
    res.status(500).json({ error: 'Error en debug' });
  }
};