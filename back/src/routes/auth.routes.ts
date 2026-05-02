// back/src/routes/auth.routes.ts
import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

// Ruta pública de login (no requiere autenticación)
router.post('/auth/login', login);

export default router;