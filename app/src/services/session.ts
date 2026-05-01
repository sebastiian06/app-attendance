const QR_TTL_MINUTES = 1; // 🔴 puedes cambiar a 10 después

export function createSession() {
  const now = new Date();

  const expiresAt = new Date(
    now.getTime() + QR_TTL_MINUTES * 60 * 1000
  );

  const session = {
    id: Date.now().toString(),
    qrToken: Math.random().toString(36).substring(2, 10),
    status: 'ACTIVE',
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
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

export function isSessionExpired(session: any) {
  if (!session) return true;

  const now = new Date();
  const expires = new Date(session.expiresAt);

  return now > expires;
}