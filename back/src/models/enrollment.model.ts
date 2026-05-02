import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
  institutionId: mongoose.Types.ObjectId;
  unitId: mongoose.Types.ObjectId;
  personId: mongoose.Types.ObjectId;
  active: boolean;
}

const EnrollmentSchema = new Schema({
  institutionId: { type: Schema.Types.ObjectId, required: true },
  unitId: { type: Schema.Types.ObjectId, ref: 'AcademicUnit', required: true },
  personId: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  active: { type: Boolean, default: true }
});

EnrollmentSchema.index({ unitId: 1, personId: 1 }, { unique: true });

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);