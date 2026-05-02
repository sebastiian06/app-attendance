// back/src/controllers/attendance.controller.ts
import { Request, Response } from 'express';
import { Session } from '../models/session.model';
import Attendance from '../models/attendance.model'; // ✅ Cambiar a Attendance (sin Record)
import Enrollment from '../models/enrollment.model';
import Person from '../models/person.model';

export const registerPublicAttendance = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { documento } = req.body;
    
    console.log('📡 Registro público:', { token, documento });
    
    if (!documento) {
      return res.status(400).json({ error: 'Documento es requerido' });
    }
    
    // 1. Buscar sesión por token QR
    const session = await Session.findOne({ 
      qrToken: token,
      status: 'active'
    });
    
    if (!session) {
      return res.status(404).json({ error: 'No hay sesión activa con este código QR' });
    }
    
    // 2. Verificar que la sesión no haya expirado
    const now = new Date();
    if (now > session.expiresAt) {
      return res.status(400).json({ error: 'La sesión ha expirado' });
    }
    
    // 3. Buscar la persona por documento en la institución de la sesión
    const person = await Person.findOne({ 
      documento: documento,
      institutionId: session.institutionId,
      roles: 'student'
    });
    
    if (!person) {
      return res.status(404).json({ 
        error: 'Documento no válido o no pertenece a esta institución' 
      });
    }
    
    // 4. Verificar que la persona esté inscrita en la unidad académica
    const enrollment = await Enrollment.findOne({
      unitId: session.unitId,
      personId: person._id,
      active: true
    });
    
    if (!enrollment) {
      return res.status(403).json({ 
        error: 'No está inscrito en esta unidad académica' 
      });
    }
    
    // 5. Verificar que no haya registrado asistencia previamente en esta sesión
    const existingRecord = await Attendance.findOne({
      sessionId: session._id,
      personId: person._id,
      status: 'accepted'
    });
    
    if (existingRecord) {
      return res.status(409).json({ 
        error: 'Ya registró su asistencia para esta sesión' 
      });
    }
    
    // 6. Registrar asistencia
    const attendance = await Attendance.create({
      sessionId: session._id,
      personId: person._id,
      documento: documento,
      status: 'accepted',
      registeredAt: new Date()
    });
    
    console.log('✅ Asistencia registrada:', attendance._id);
    
    res.json({
      success: true,
      message: 'Asistencia registrada exitosamente',
      data: {
        nombre: person.nombre,
        documento: person.documento,
        registeredAt: attendance.registeredAt
      }
    });
    
  } catch (error) {
    console.error('❌ Error registerPublicAttendance:', error);
    res.status(500).json({ error: 'Error al registrar asistencia' });
  }
};