import mongoose, { Schema, Document } from 'mongoose';

export interface IPerson extends Document {
  institutionId: mongoose.Types.ObjectId;
  documento: string;
  nombre: string;
  matricula?: string;
  roles: string[];
}

const PersonSchema = new Schema({
  institutionId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Institution', 
    required: true 
  },
  documento: { 
    type: String, 
    required: true 
  },
  nombre: { 
    type: String, 
    required: true 
  },
  matricula: { 
    type: String 
  },
  roles: [{ 
    type: String, 
    enum: ['teacher', 'student'],
    default: ['student']
  }]
}, {
  timestamps: true
});

// Índice compuesto único
PersonSchema.index({ institutionId: 1, documento: 1 }, { unique: true });

export default mongoose.model<IPerson>('Person', PersonSchema);