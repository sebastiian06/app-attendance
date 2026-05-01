import { Router } from 'express';
import { registerAttendance } from '../controllers/attendance.controller';

const router = Router();

router.post('/attendance/:token/register', registerAttendance);

export default router;