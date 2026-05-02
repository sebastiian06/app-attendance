// app/src/services/api.ts

// ============================================
// CONFIGURACIÓN DINÁMICA PARA ANDROID
// ============================================

const getApiUrl = () => {
  // Detectar si está en Capacitor (app móvil)
  const isCapacitor = !!(window as any).Capacitor;
  
  // Detectar si es Android
  const isAndroid = /android/i.test(navigator.userAgent);
  
  console.log('🔧 Debug - isCapacitor:', isCapacitor);
  console.log('🔧 Debug - isAndroid:', isAndroid);
  
  if (isCapacitor && isAndroid) {
    // Emulador Android - 10.0.2.2 apunta al host
    return 'http://10.0.2.2:4000/api';
  }
  
  if (isCapacitor && !isAndroid) {
    // iOS
    return 'http://localhost:4000/api';
  }
  
  // Web local
  return 'http://localhost:4000/api';
};

const API_URL = getApiUrl();
console.log('✅ API_URL:', API_URL);

// ============================================
// AUTENTICACIÓN
// ============================================

export const login = async (documento: string, password: string) => {
  try {
    console.log('🔐 Intentando login:', { documento });
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documento, password }),
    });

    const data = await response.json();
    console.log('📡 Respuesta login:', { status: response.status, data });

    if (!response.ok) {
      throw new Error(data.error?.message || `Error ${response.status}: Credenciales inválidas`);
    }

    if (!data.token) {
      throw new Error('El servidor no devolvió un token válido');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user || { documento, name: 'Docente' }));
    
    console.log('✅ Login exitoso, token guardado');
    return data;
    
  } catch (error: any) {
    console.error('❌ Error en login:', error);
    throw error;
  }
};

export const logout = () => {
  console.log('🚪 Cerrando sesión...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('selectedInstitution');
  localStorage.removeItem('selectedUnit');
  localStorage.removeItem('currentSession');
  localStorage.removeItem('currentSessionId');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null && token !== undefined && token.length > 0;
};

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('⚠️ No hay token disponible');
  }
  return token;
};

// ============================================
// INSTITUCIONES
// ============================================

export const getInstitutions = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación. Por favor, inicie sesión nuevamente.');
    }
    
    console.log('📡 GET /institutions');
    
    const response = await fetch(`${API_URL}/institutions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📡 Status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Instituciones recibidas:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error en getInstitutions:', error);
    throw error;
  }
};

// ============================================
// UNIDADES ACADÉMICAS (Materias/Fichas)
// ============================================

export const getAcademicUnits = async (institutionId: string) => {
  try {
    if (!institutionId) {
      throw new Error('institutionId es requerido');
    }
    
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    const url = `${API_URL}/institutions/${institutionId}/units`;
    console.log('📡 GET:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📡 Status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        throw new Error('Sesión expirada');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Error ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Unidades recibidas:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error en getAcademicUnits:', error);
    throw error;
  }
};

// ============================================
// ESTUDIANTES
// ============================================

export const getStudentsByUnit = async (unitId: string) => {
  try {
    if (!unitId) {
      throw new Error('unitId es requerido');
    }
    
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    const url = `${API_URL}/units/${unitId}/students`;
    console.log('📡 GET:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📡 Status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        throw new Error('Sesión expirada');
      }
      if (response.status === 404) {
        const errorData = await response.json().catch(() => ({}));
        console.log('⚠️ No hay estudiantes:', errorData.error);
        return [];
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Estudiantes recibidos:', data);
    return Array.isArray(data) ? data : [];
    
  } catch (error) {
    console.error('❌ Error en getStudentsByUnit:', error);
    throw error;
  }
};

// ============================================
// SESIONES QR
// ============================================

export const createSession = async (unitId: string, institutionId: string) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    console.log('📡 POST /sessions', { unitId, institutionId });
    
    const response = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        institutionId,
        unitId
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Sesión creada:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error en createSession:', error);
    throw error;
  }
};

export const activateSession = async (sessionId: string) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    console.log('📡 POST /sessions/${sessionId}/activate');
    
    const response = await fetch(`${API_URL}/sessions/${sessionId}/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Sesión activada:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error en activateSession:', error);
    throw error;
  }
};

export const getSessionResults = async (sessionId: string) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    console.log('📡 GET /sessions/${sessionId}/results');
    
    const response = await fetch(`${API_URL}/sessions/${sessionId}/results`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('❌ Error en getSessionResults:', error);
    throw error;
  }
};

// ============================================
// REGISTRO PÚBLICO (QR)
// ============================================

export const registerAttendance = async (qrToken: string, documento: string) => {
  try {
    console.log('📡 Registrando asistencia pública:', { qrToken, documento });
    
    const response = await fetch(`${API_URL}/public/attendance/${qrToken}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documento })
    });
    
    const data = await response.json();
    console.log('📡 Respuesta:', { status: response.status, data });
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al registrar asistencia');
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Error en registerAttendance:', error);
    throw error;
  }
};

// ============================================
// HELPER PARA DEBUG
// ============================================

export const checkBackendHealth = async () => {
  try {
    const response = await fetch('http://localhost:4000/health');
    const data = await response.json();
    console.log('🏥 Backend health:', data);
    return response.ok;
  } catch (error) {
    console.error('❌ Backend no disponible:', error);
    return false;
  }
};

export default {
  login,
  logout,
  isAuthenticated,
  getInstitutions,
  getAcademicUnits,
  getStudentsByUnit,
  createSession,
  activateSession,
  getSessionResults,
  registerAttendance,
  checkBackendHealth
};