// 🔹 Tipos (muy importante para evitar errores)
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

// 🔹 Mock de estudiantes (luego vendrá del backend)
const estudiantes = [
  { documento: 'EST-001', nombre: 'Juan' },
  { documento: 'EST-002', nombre: 'Maria' },
  { documento: 'EST-003', nombre: 'Carlos' }
];

// 🔹 Helper seguro para localStorage
function getLocalData<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

// 🔹 Registrar asistencia
export function registerAttendance(
  token: string,
  documento: string
): AttendanceResult {
  const session = getLocalData<any>('session', null);

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

  const estudiante = estudiantes.find(e => e.documento === documento);

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

  const record: AttendanceRecord = {
    sessionId: session.id,
    documento,
    nombre: estudiante.nombre,
    status: 'ACCEPTED'
  };

  saveRecord(record);

  return { status: 'ACCEPTED' };
}

// 🔹 Guardar registro (centralizado)
function saveRecord(record: AttendanceRecord) {
  const records = getLocalData<AttendanceRecord[]>('attendance', []);
  records.push(record);
  localStorage.setItem('attendance', JSON.stringify(records));
}

// 🔹 Obtener registros por sesión
export function getAttendanceBySession(): AttendanceRecord[] {
  const session = getLocalData<any>('session', null);
  const records = getLocalData<AttendanceRecord[]>('attendance', []);

  if (!session) return [];

  return records.filter(r => r.sessionId === session.id);
}