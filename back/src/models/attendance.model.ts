import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  documento: String,
  nombre: String,
  status: { type: String, enum: ['ACCEPTED', 'REJECTED'] },
  reason: String,
  createdAt: { type: Date, default: Date.now }
});

export const Attendance = mongoose.model('Attendance', attendanceSchema);