import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademicUnit extends Document {
  institutionId: mongoose.Types.ObjectId;
  code: string;
  name: string;
  type: 'ficha' | 'materia';
  active: boolean;
}

const AcademicUnitSchema = new Schema({
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['ficha', 'materia'], required: true },
  active: { type: Boolean, default: true }
});

AcademicUnitSchema.index({ institutionId: 1, code: 1 }, { unique: true });

export default mongoose.model<IAcademicUnit>('AcademicUnit', AcademicUnitSchema);