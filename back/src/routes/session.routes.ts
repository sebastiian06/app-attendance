// back/src/routes/session.routes.ts
import { Router } from 'express';
import { 
  createSession, 
  activateSession, 
  getSession, 
  closeSession,
  getSessionResults,
  getSessionsByUnit,
  checkSessionByToken,
  expireOldSessions
} from '../controllers/session.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Rutas protegidas (requieren autenticación)
router.post('/sessions', authenticate, createSession);
router.post('/sessions/:sessionId/activate', authenticate, activateSession);
router.get('/sessions/:sessionId', authenticate, getSession);
router.post('/sessions/:sessionId/close', authenticate, closeSession);
router.get('/sessions/:sessionId/results', authenticate, getSessionResults);
router.get('/sessions/unit/:unitId', authenticate, getSessionsByUnit);

// Ruta pública para verificar QR (no requiere autenticación)
router.get('/public/session/token/:token', checkSessionByToken);

// Ruta para expirar sesiones (puede ser ejecutada por un cron job)
router.post('/sessions/expire-old', authenticate, expireOldSessions);

export default router;