// back/src/controllers/session.controller.ts
import { Request, Response } from 'express';
import { Session } from '../models/session.model';
import Attendance from '../models/attendance.model';
import Enrollment from '../models/enrollment.model';

// ============================================
// CREAR SESIÓN
// ============================================
export const createSession = async (req: Request, res: Response) => {
  try {
    const { institutionId, unitId } = req.body;
    
    console.log('📡 Creando sesión:', { institutionId, unitId });
    
    // Validar campos requeridos
    if (!institutionId && !unitId) {
      if (req.body.unitId) {
        console.log('⚠️ Usando unitId sin institutionId');
      } else {
        return res.status(400).json({ error: 'institutionId y unitId son requeridos' });
      }
    }
    
    const finalUnitId = unitId || req.body.unitId;
    const finalInstitutionId = institutionId || new (await import('mongoose')).Types.ObjectId();
    
    // Verificar que no haya una sesión activa para esta unidad
    const existingActiveSession = await Session.findOne({
      unitId: finalUnitId,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });
    
    if (existingActiveSession) {
      console.log('⚠️ Ya existe una sesión activa para esta unidad');
      return res.status(409).json({ 
        error: 'Ya existe una sesión activa para esta unidad',
        session: existingActiveSession
      });
    }
    
    // Crear nueva sesión
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutos
    const qrToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 5);
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const session = await Session.create({
      institutionId: finalInstitutionId,
      unitId: finalUnitId,
      qrToken: qrToken,
      roomCode: roomCode,
      status: 'active',
      qrExpiresAt: expiresAt,
      expiresAt: expiresAt,
      createdAt: now
    });
    
    console.log('✅ Sesión creada:', {
      id: session._id,
      qrToken: session.qrToken,
      expiresAt: session.expiresAt
    });
    
    res.status(201).json(session);
    
  } catch (error) {
    console.error('❌ Error en createSession:', error);
    res.status(500).json({ error: 'Error al crear la sesión' });
  }
};

// ============================================
// ACTIVAR SESIÓN
// ============================================
export const activateSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    console.log('📡 Activando sesión:', sessionId);
    
    if (!sessionId || sessionId.length !== 24) {
      return res.status(400).json({ error: 'ID de sesión inválido' });
    }
    
    const session = await Session.findByIdAndUpdate(
      sessionId,
      { status: 'active' },
      { new: true }
    );
    
    if (!session) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }
    
    console.log('✅ Sesión activada:', session._id);
    res.json(session);
    
  } catch (error) {
    console.error('❌ Error en activateSession:', error);
    res.status(500).json({ error: 'Error al activar la sesión' });
  }
};

// ============================================
// OBTENER SESIÓN POR ID
// ============================================
export const getSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    console.log('📡 Obteniendo sesión:', sessionId);
    
    if (!sessionId || sessionId.length !== 24) {
      return res.status(400).json({ error: 'ID de sesión inválido' });
    }
    
    const session = await Session.findById(sessionId)
      .populate('institutionId', 'name code')
      .populate('unitId', 'name code type');
    
    if (!session) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }
    
    console.log('✅ Sesión encontrada:', session._id);
    res.json(session);
    
  } catch (error) {
    console.error('❌ Error en getSession:', error);
    res.status(500).json({ error: 'Error al obtener la sesión' });
  }
};

// ============================================
// CERRAR SESIÓN
// ============================================
export const closeSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    console.log('📡 Cerrando sesión:', sessionId);
    
    if (!sessionId || sessionId.length !== 24) {
      return res.status(400).json({ error: 'ID de sesión inválido' });
    }
    
    const session = await Session.findByIdAndUpdate(
      sessionId,
      { status: 'closed' },
      { new: true }
    );
    
    if (!session) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }
    
    console.log('✅ Sesión cerrada:', session._id);
    res.json(session);
    
  } catch (error) {
    console.error('❌ Error en closeSession:', error);
    res.status(500).json({ error: 'Error al cerrar la sesión' });
  }
};

// ============================================
// OBTENER RESULTADOS DE LA SESIÓN
// ============================================
export const getSessionResults = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    console.log('📡 Obteniendo resultados para sesión:', sessionId);
    
    if (!sessionId || sessionId.length !== 24) {
      return res.status(400).json({ error: 'ID de sesión inválido' });
    }
    
    // 1. Obtener la sesión
    const session = await Session.findById(sessionId)
      .populate('institutionId', 'name code')
      .populate('unitId', 'name code type');
    
    if (!session) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }
    
    console.log('✅ Sesión encontrada:', {
      id: session._id,
      unitId: session.unitId,
      status: session.status
    });
    
    // 2. Obtener todos los estudiantes inscritos en la unidad
    const enrollments = await Enrollment.find({ 
      unitId: session.unitId, 
      active: true 
    }).populate('personId');
    
    console.log('📊 Matrículas encontradas:', enrollments.length);
    
    // Filtrar solo estudiantes
    const students = [];
    for (const enrollment of enrollments) {
      const person = enrollment.personId as any;
      if (person && person.roles && person.roles.includes('student')) {
        students.push({
          _id: person._id,
          documento: person.documento,
          nombre: person.nombre,
          matricula: person.matricula || ''
        });
      }
    }
    
    console.log('👨‍🎓 Estudiantes encontrados:', students.length);
    
    // 3. Obtener todos los registros de asistencia de esta sesión
    const attendanceRecords = await Attendance.find({ 
      sessionId: session._id 
    });
    
    console.log('📝 Registros de asistencia:', attendanceRecords.length);
    
    // 4. Calcular resumen
    const total = students.length;
    const present = attendanceRecords.filter(a => a.status === 'accepted').length;
    const absent = total - present;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
    
    console.log('📊 Resumen:', { total, present, absent, attendanceRate });
    
    res.json({
      session: {
        _id: session._id,
        unitId: session.unitId,
        institutionId: session.institutionId,
        status: session.status,
        qrToken: session.qrToken,
        roomCode: session.roomCode,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt
      },
      students: students,
      attendance: attendanceRecords.map(a => ({
        _id: a._id,
        personId: a.personId,
        documento: a.documento,
        status: a.status,
        registeredAt: a.registeredAt,
        rejectReason: a.rejectReason
      })),
      summary: {
        total,
        present,
        absent,
        attendanceRate
      }
    });
    
  } catch (error) {
    console.error('❌ Error en getSessionResults:', error);
    res.status(500).json({ error: 'Error al obtener resultados' });
  }
};

// ============================================
// OBTENER TODAS LAS SESIONES DE UNA UNIDAD
// ============================================
export const getSessionsByUnit = async (req: Request, res: Response) => {
  try {
    const { unitId } = req.params;
    
    console.log('📡 Obteniendo sesiones para unidad:', unitId);
    
    if (!unitId || unitId.length !== 24) {
      return res.status(400).json({ error: 'ID de unidad inválido' });
    }
    
    const sessions = await Session.find({ 
      unitId: unitId 
    }).sort({ createdAt: -1 });
    
    console.log('✅ Sesiones encontradas:', sessions.length);
    res.json(sessions);
    
  } catch (error) {
    console.error('❌ Error en getSessionsByUnit:', error);
    res.status(500).json({ error: 'Error al obtener las sesiones' });
  }
};

// ============================================
// VERIFICAR SESIÓN POR TOKEN QR
// ============================================
export const checkSessionByToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    
    console.log('📡 Verificando sesión por token:', token);
    
    if (!token) {
      return res.status(400).json({ error: 'Token es requerido' });
    }
    
    const session = await Session.findOne({ 
      qrToken: token,
      status: 'active'
    });
    
    if (!session) {
      return res.status(404).json({ 
        active: false,
        error: 'No hay sesión activa con este código QR' 
      });
    }
    
    const now = new Date();
    const isExpired = now > session.expiresAt;
    
    console.log('✅ Sesión encontrada:', { 
      id: session._id, 
      isExpired,
      expiresAt: session.expiresAt
    });
    
    res.json({
      active: !isExpired,
      sessionId: session._id,
      expiresAt: session.expiresAt,
      roomCode: session.roomCode
    });
    
  } catch (error) {
    console.error('❌ Error en checkSessionByToken:', error);
    res.status(500).json({ error: 'Error al verificar la sesión' });
  }
};

// ============================================
// EXPIRAR SESIONES VENCIDAS
// ============================================
export const expireOldSessions = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    
    const result = await Session.updateMany(
      { 
        status: 'active',
        expiresAt: { $lt: now }
      },
      { status: 'expired' }
    );
    
    console.log(`⏰ Sesiones expiradas: ${result.modifiedCount}`);
    res.json({ 
      message: 'Sesiones expiradas actualizadas',
      expiredCount: result.modifiedCount
    });
    
  } catch (error) {
    console.error('❌ Error en expireOldSessions:', error);
    res.status(500).json({ error: 'Error al expirar sesiones' });
  }
};