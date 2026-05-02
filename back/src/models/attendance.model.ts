// back/src/models/attendance.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  sessionId: mongoose.Types.ObjectId;
  personId: mongoose.Types.ObjectId;
  documento: string;
  status: 'accepted' | 'rejected';
  rejectReason?: string;
  registeredAt: Date;
}

const attendanceSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  personId: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  documento: { type: String, required: true },
  status: { type: String, enum: ['accepted', 'rejected'], default: 'accepted' },
  rejectReason: { type: String },
  registeredAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Índice compuesto para evitar duplicados
attendanceSchema.index({ sessionId: 1, personId: 1 }, { unique: true });

// Índice para búsquedas rápidas
attendanceSchema.index({ sessionId: 1, status: 1 });

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);