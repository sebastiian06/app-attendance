// app/src/models/types.ts
export interface Institution {
  _id: string;
  code: string;
  name: string;
  context: string;
  labels: string[];
  active: boolean;
}

export interface AcademicUnit {
  _id: string;
  institutionId: string | Institution;
  code: string;
  name: string;
  type: 'ficha' | 'materia';
  active: boolean;
}

export interface Student {
  _id: string;
  documento: string;
  nombre: string;
  matricula?: string;
  roles: string[];
}

export interface User {
  documento: string;
  name: string;
  role: string;
}

export interface Session {
  _id: string;
  institutionId: string;
  unitId: string;
  status: 'active' | 'closed' | 'expired';
  qrToken: string;
  qrExpiresAt: string;
  roomCode?: string;
}

export interface AttendanceRecord {
  sessionId: string;
  personId: string;
  documento: string;
  status: 'accepted' | 'rejected';
  rejectReason?: string;
  registeredAt: string;
}