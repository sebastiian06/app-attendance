// back/src/routes/public.routes.ts
import { Router } from 'express';
import { registerPublicAttendance } from '../controllers/attendance.controller';

const router = Router();

// Ruta pública para registrar asistencia (no requiere autenticación)
router.post('/public/attendance/:token/register', registerPublicAttendance);

// Ruta de prueba para verificar que el servidor responde
router.get('/public/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servicio público disponible' });
});

export default router;