import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/app_attendance');
    console.log('MongoDB conectado');
  } catch (error) {
    console.error(error);
  }
};