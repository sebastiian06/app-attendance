// back/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'temp-secret-key-change-in-production';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    console.log('🔐 Verificando autenticación...');
    console.log('📋 Authorization header:', authHeader ? 'Presente' : 'Ausente');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Token no proporcionado o formato incorrecto');
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    const token = authHeader.split(' ')[1];
    console.log('🔑 Token recibido:', token.substring(0, 30) + '...');
    
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    
    console.log('✅ Usuario autenticado:', decoded);
    next();
  } catch (error) {
    console.log('❌ Token inválido:', error);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};