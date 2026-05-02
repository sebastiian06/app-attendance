// back/src/models/session.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  institutionId: mongoose.Types.ObjectId;
  unitId: mongoose.Types.ObjectId;
  qrToken: string;
  roomCode: string;
  status: 'active' | 'closed' | 'expired';
  qrExpiresAt: Date;
  expiresAt: Date;
  createdAt: Date;
}

const sessionSchema = new Schema({
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
  unitId: { type: Schema.Types.ObjectId, ref: 'AcademicUnit', required: true },
  qrToken: { type: String, unique: true, required: true },
  roomCode: { type: String, required: true },
  status: { type: String, enum: ['active', 'closed', 'expired'], default: 'active' },
  qrExpiresAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Índice para búsquedas rápidas
sessionSchema.index({ qrToken: 1 });
sessionSchema.index({ unitId: 1, status: 1 });

export const Session = mongoose.model<ISession>('Session', sessionSchema);