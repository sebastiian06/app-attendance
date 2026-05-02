// app/src/pages/Login.tsx
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonLoading,
  IonIcon
} from '@ionic/react';
import { useState } from 'react';
import { login } from '../services/api';
import { useHistory } from 'react-router-dom';
import { schoolOutline, logInOutline, qrCodeOutline } from 'ionicons/icons';

const Login: React.FC = () => {
  const [documento, setDocumento] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async () => {
    if (!documento.trim()) {
      setError('Por favor ingrese su documento');
      return;
    }

    if (!password.trim()) {
      setError('Por favor ingrese su contraseña');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(documento, password);
      localStorage.setItem('userRole', 'teacher');
      history.push('/institutions');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setDocumento('DOCENTE-001');
    setPassword('demo123');
    setError('');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>App Attendance</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f5f7fa' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 56px)'
        }}>

          <div style={{ width: '100%', maxWidth: '380px' }}>

            <IonLoading isOpen={loading} message="Iniciando sesión..." />

            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                width: '72px',
                height: '72px',
                borderRadius: '18px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(76,175,80,0.3)'
              }}>
                <IonIcon icon={schoolOutline} style={{ fontSize: '38px', color: 'white' }} />
              </div>

              <h2 style={{ marginTop: '18px', marginBottom: '6px', color: '#222' }}>
                App Attendance
              </h2>

              <p style={{ fontSize: '13px', color: '#777' }}>
                Sistema de Asistencia Académica
              </p>
            </div>

            {/* Card */}
            <div style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '18px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
            }}>

              {/* Documento */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12px', color: '#666' }}>
                  Documento
                </label>

                <IonInput
                  className="material-input"
                  value={documento}
                  onIonChange={(e) => setDocumento(e.detail.value || '')}
                  placeholder="DOCENTE-001"
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12px', color: '#666' }}>
                  Contraseña
                </label>

                <IonInput
                  className="material-input"
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value || '')}
                  placeholder="••••••••"
                />
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  background: '#ffebee',
                  padding: '10px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  marginBottom: '16px',
                  fontSize: '13px'
                }}>
                  <IonText color="danger">{error}</IonText>
                </div>
              )}

              {/* Botones */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'transparent',
                    border: '1px solid #4CAF50',
                    borderRadius: '12px',
                    color: '#4CAF50',
                    fontWeight: '500',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Iniciar sesión
                </button>

                <button
                  onClick={fillDemoCredentials}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'transparent',
                    border: '1px solid #4CAF50',
                    borderRadius: '12px',
                    color: '#4CAF50',
                    fontWeight: '500',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Usar credenciales de prueba
                </button>
            </div>

            {/* Footer */}
            <div style={{
              textAlign: 'center',
              marginTop: '25px',
              fontSize: '12px',
              color: '#999'
            }}>
              <IonIcon icon={qrCodeOutline} style={{ marginRight: '4px' }} />
              Sistema de Asistencia por QR
            </div>

          </div>
        </div>
      </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;