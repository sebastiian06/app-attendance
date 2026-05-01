export function createSession() {
  const session = {
    id: Date.now().toString(),
    qrToken: Math.random().toString(36).substring(2, 10),
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  };

  localStorage.setItem('session', JSON.stringify(session));

  return session;
}

export function getSession() {
  const data = localStorage.getItem('session');
  return data ? JSON.parse(data) : null;
}

export function closeSession() {
  localStorage.removeItem('session');
}