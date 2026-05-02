// back/src/index.ts (versión completa y corregida)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/auth.routes';
import sessionRoutes from './routes/session.routes';
import publicRoutes from './routes/public.routes';
import institutionRoutes from './routes/institution.routes'; // ✅ IMPORTANTE

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Logging de requests (para debug)
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/app_attendance';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Rutas
app.use('/api', authRoutes);
app.use('/api', sessionRoutes);
app.use('/api', publicRoutes);
app.use('/api', institutionRoutes); // ✅ Asegurar que esta línea existe

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/ready', (req, res) => {
  res.json({ status: 'ready', timestamp: new Date() });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   POST ${PORT}/api/auth/login`);
  console.log(`   GET  ${PORT}/api/institutions`);
  console.log(`   GET  ${PORT}/api/institutions/:id/units`);
  console.log(`   GET  ${PORT}/api/units/:id/students`);
  console.log(`   GET  ${PORT}/health\n`);
});