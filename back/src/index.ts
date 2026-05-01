import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import sessionRoutes from './routes/session.routes';
import publicRoutes from './routes/public.routes';

// 🔹 Crear app PRIMERO
const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());
app.use('/public', publicRoutes);

// 🔹 Conectar BD
connectDB();

// 🔹 Rutas
app.use('/api/sessions', sessionRoutes);

// 🔹 Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 🔹 Levantar servidor
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});