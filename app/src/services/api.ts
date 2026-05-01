const API_URL = 'http://localhost:4000'; // luego lo moveremos a .env

export async function login(documento: string, password: string) {
  // 🔴 MOCK temporal (luego lo cambiamos por fetch real)
  if (documento === 'DOC-DEMO-001' && password === '123456') {
    return {
      token: 'fake-jwt-token',
      user: {
        nombre: 'Docente Demo',
        documento,
        roles: ['DOCENTE']
      }
    };
  }

  throw new Error('Credenciales inválidas');
}