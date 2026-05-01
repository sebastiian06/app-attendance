const API_URL = 'http://localhost:4000'; // luego lo moveremos a .env

export async function login(documento: string, password: string) {
  if (documento === 'DOC-DEMO-001' && password === '123456') {
    const data = {
      token: 'fake-jwt-token',
      user: {
        nombre: 'Docente Demo',
        documento,
        roles: ['DOCENTE']
      }
    };

    // 🔹 Guardar sesión
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  }

  throw new Error('Credenciales inválidas');
}