// back/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'temp-secret-key-change-in-production';

export const login = async (req: Request, res: Response) => {
  try {
    const { documento, password } = req.body;
    
    console.log('📝 Intento de login:', { documento, password: '***' });
    
    // ✅ CREDENCIALES DEMO para pruebas
    // En un sistema real, esto validaría contra la base de datos
    const validCredentials = [
      { documento: 'DOCENTE-001', password: 'demo123', name: 'Profesor Juan Pérez' },
      { documento: 'DOCENTE-002', password: 'demo123', name: 'Instructora María Gómez' },
      { documento: 'admin', password: 'admin123', name: 'Administrador' }
    ];
    
    // Buscar credenciales válidas
    const user = validCredentials.find(
      cred => cred.documento === documento && cred.password === password
    );
    
    if (!user) {
      console.log('❌ Login fallido: credenciales inválidas');
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Documento o contraseña incorrectos'
        }
      });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { 
        documento: user.documento,
        name: user.name,
        role: 'teacher'
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    console.log('✅ Login exitoso:', user.documento);
    
    // Devolver respuesta exitosa
    return res.json({
      token,
      user: {
        documento: user.documento,
        name: user.name,
        role: 'teacher'
      }
    });
    
  } catch (error) {
    console.error('❌ Error en login:', error);
    return res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Error interno del servidor'
      }
    });
  }
};