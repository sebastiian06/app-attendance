// app/src/services/session.service.ts
import { createSession as createSessionAPI } from './api';

const API_URL = 'http://localhost:4000/api/sessions';

export async function createSession(unitId: string, institutionId: string) {
  try {
    return await createSessionAPI(unitId, institutionId);
  } catch (error) {
    console.error('ERROR createSession:', error);
    return null;
  }
}

export function getLocalSession() {
  const data = localStorage.getItem('currentSession');
  return data ? JSON.parse(data) : null;
}

export function saveLocalSession(session: any) {
  localStorage.setItem('currentSession', JSON.stringify(session));
}

export function removeLocalSession() {
  localStorage.removeItem('currentSession');
}

export function isSessionExpired(session: any) {
  if (!session) return true;
  const now = new Date();
  const expires = new Date(session.expiresAt);
  return now > expires;
}