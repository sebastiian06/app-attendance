import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  unitId: String,
  qrToken: { type: String, unique: true },
  status: { type: String, default: 'ACTIVE' },
  expiresAt: Date
});

export const Session = mongoose.model('Session', sessionSchema);