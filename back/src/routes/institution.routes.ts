// back/src/routes/institution.routes.ts
import { Router } from 'express';
import { 
  getInstitutions, 
  getAcademicUnitsByInstitution, 
  getStudentsByUnit,
  debugInstitutionData  // ✅ Importar función debug
} from '../controllers/institution.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/institutions', authenticate, getInstitutions);
router.get('/institutions/:institutionId/units', authenticate, getAcademicUnitsByInstitution);
router.get('/units/:unitId/students', authenticate, getStudentsByUnit);
router.get('/debug/data', authenticate, debugInstitutionData);  // ✅ Ruta de debug

export default router;