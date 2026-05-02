import mongoose, { Schema, Document } from 'mongoose';

export interface IInstitution extends Document {
  code: string;
  name: string;
  context: string;
  labels: string[];
  active: boolean;
}

const InstitutionSchema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  context: { type: String, required: true },
  labels: [String],
  active: { type: Boolean, default: true }
});

export default mongoose.model<IInstitution>('Institution', InstitutionSchema);