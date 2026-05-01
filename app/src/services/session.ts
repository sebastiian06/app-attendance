// 🔹 URL base del backend
const API_URL = 'http://localhost:4000/api/sessions';

// 🔹 Crear sesión (llama al backend)
export async function createSession(unitId: string) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ unitId })
    });

    if (!res.ok) {
      throw new Error('Error al crear la sesión');
    }

    const data = await res.json();

    // 🔹 Guardamos solo para uso temporal en frontend
    localStorage.setItem('session', JSON.stringify(data));

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 🔹 Obtener sesión actual (temporal)
export function getSession() {
  const data = localStorage.getItem('session');
  return data ? JSON.parse(data) : null;
}

// 🔹 Cerrar sesión (solo frontend por ahora)
export function closeSession() {
  localStorage.removeItem('session');
}

// 🔹 Validar expiración (frontend UX)
export function isSessionExpired(session: any) {
  if (!session) return true;

  const now = new Date();
  const expires = new Date(session.expiresAt);

  return now > expires;
}