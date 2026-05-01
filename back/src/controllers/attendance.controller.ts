import { Request, Response } from 'express';
import { Session } from '../models/session.model';
import { Attendance } from '../models/attendance.model';

const estudiantes = [
  { documento: 'EST-001', nombre: 'Juan' },
  { documento: 'EST-002', nombre: 'Maria' },
  { documento: 'EST-003', nombre: 'Carlos' }
];

export const registerAttendance = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { documento } = req.body;

  const session = await Session.findOne({ qrToken: token });

  // ❌ Token inválido
  if (!session) {
    return res.json({ status: 'REJECTED', reason: 'Token inválido' });
  }

  // ❌ Expirado
  if (!session.expiresAt || new Date() > new Date(session.expiresAt)) {
    await Attendance.create({
      sessionId: session._id,
      documento,
      status: 'REJECTED',
      reason: 'QR expirado'
    });

    return res.json({ status: 'REJECTED', reason: 'QR expirado' });
  }

  const estudiante = estudiantes.find(e => e.documento === documento);

  // ❌ No inscrito
  if (!estudiante) {
    await Attendance.create({
      sessionId: session._id,
      documento,
      status: 'REJECTED',
      reason: 'No inscrito'
    });

    return res.json({ status: 'REJECTED', reason: 'No inscrito' });
  }

  // ❌ Duplicado
  const duplicado = await Attendance.findOne({
    sessionId: session._id,
    documento,
    status: 'ACCEPTED'
  });

  if (duplicado) {
    await Attendance.create({
      sessionId: session._id,
      documento,
      nombre: estudiante.nombre,
      status: 'REJECTED',
      reason: 'Ya registrado'
    });

    return res.json({ status: 'REJECTED', reason: 'Ya registrado' });
  }

  // ✅ Registro válido
  await Attendance.create({
    sessionId: session._id,
    documento,
    nombre: estudiante.nombre,
    status: 'ACCEPTED'
  });

  return res.json({ status: 'ACCEPTED' });
};