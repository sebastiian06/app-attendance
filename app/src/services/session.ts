const API_URL = 'http://localhost:4000/api/sessions';

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

    console.log('SESSION API:', data);

    localStorage.setItem('session', JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('ERROR createSession:', error);
    return null;
  }
}

export function getSession() {
  const data = localStorage.getItem('session');
  return data ? JSON.parse(data) : null;
}

export function closeSession() {
  localStorage.removeItem('session');
}

export function isSessionExpired(session: any) {
  if (!session) return true;

  const now = new Date();
  const expires = new Date(session.expiresAt);

  return now > expires;
}