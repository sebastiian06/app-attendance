import { isSessionExpired } from './session';

// 🔹 Tipos
type AttendanceRecord = {
  sessionId: string;
  documento: string;
  nombre?: string;
  status: 'ACCEPTED' | 'REJECTED';
  reason?: string;
};

type AttendanceResult =
  | { status: 'ACCEPTED' }
  | { status: 'REJECTED'; reason: string };

// 🔹 Mock estudiantes
const estudiantes = [
  { documento: 'EST-001', nombre: 'Juan' },
  { documento: 'EST-002', nombre: 'Maria' },
  { documento: 'EST-003', nombre: 'Carlos' }
];

// 🔹 Helper seguro
function getLocalData<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

// 🔹 Guardar registro
function saveRecord(record: AttendanceRecord) {
  const records = getLocalData<AttendanceRecord[]>('attendance', []);
  records.push(record);
  localStorage.setItem('attendance', JSON.stringify(records));
}

// 🔹 Registrar asistencia
export function registerAttendance(
  token: string,
  documento: string
): AttendanceResult {
  const session = getLocalData<any>('session', null);

  // ❌ Sesión inválida
  if (!session || session.qrToken !== token) {
    const record: AttendanceRecord = {
      sessionId: session?.id || 'unknown',
      documento,
      status: 'REJECTED',
      reason: 'Token inválido o sesión cerrada'
    };

    saveRecord(record);
    return { status: 'REJECTED', reason: record.reason! };
  }

  // ❌ QR expirado
  if (isSessionExpired(session)) {
    const record: AttendanceRecord = {
      sessionId: session.id,
      documento,
      status: 'REJECTED',
      reason: 'QR expirado'
    };

    saveRecord(record);
    return { status: 'REJECTED', reason: 'QR expirado' };
  }

  const estudiante = estudiantes.find(e => e.documento === documento);

  // ❌ No inscrito
  if (!estudiante) {
    const record: AttendanceRecord = {
      sessionId: session.id,
      documento,
      status: 'REJECTED',
      reason: 'No está inscrito'
    };

    saveRecord(record);
    return { status: 'REJECTED', reason: record.reason! };
  }

  const records = getLocalData<AttendanceRecord[]>('attendance', []);

  const duplicado = records.find(
    r => r.sessionId === session.id && r.documento === documento
  );

  // ❌ Duplicado
  if (duplicado) {
    const record: AttendanceRecord = {
      sessionId: session.id,
      documento,
      nombre: estudiante.nombre,
      status: 'REJECTED',
      reason: 'Ya registrado'
    };

    saveRecord(record);
    return { status: 'REJECTED', reason: record.reason! };
  }

  // ✅ Registro válido
  const record: AttendanceRecord = {
    sessionId: session.id,
    documento,
    nombre: estudiante.nombre,
    status: 'ACCEPTED'
  };

  saveRecord(record);

  return { status: 'ACCEPTED' };
}

// 🔹 Obtener registros
export function getAttendanceBySession(): AttendanceRecord[] {
  const session = getLocalData<any>('session', null);
  const records = getLocalData<AttendanceRecord[]>('attendance', []);

  if (!session) return [];

  return records.filter(r => r.sessionId === session.id);
}