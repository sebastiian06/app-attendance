// app/src/pages/Login.tsx
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonLoading,
  IonIcon,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { useState } from 'react';
import { login } from '../services/api';
import { useHistory } from 'react-router-dom';
import { schoolOutline, qrCodeOutline, logInOutline, personOutline, keyOutline } from 'ionicons/icons';

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

      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message="Iniciando sesión..." />

        {/* Logo y título */}
        <div className="ion-text-center" style={{ marginTop: '40px', marginBottom: '40px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(76,175,80,0.3)'
          }}>
            <IonIcon icon={schoolOutline} style={{ fontSize: '45px', color: 'white' }} />
          </div>
          <h1 style={{ marginTop: '20px', marginBottom: '5px', fontSize: '28px', fontWeight: 'bold' }}>
            App Attendance
          </h1>
          <p style={{ color: '#666', marginTop: '0' }}>
            Sistema de Asistencia Académica
          </p>
        </div>

        {/* Formulario */}
        <IonCard style={{ borderRadius: '20px', marginTop: '20px' }}>
          <IonCardContent>
            <IonItem lines="none">
              <IonIcon icon={personOutline} slot="start" color="primary" />
              <IonLabel position="stacked">Documento</IonLabel>
              <IonInput
                type="text"
                value={documento}
                onIonChange={(e) => setDocumento(e.detail.value || '')}
                placeholder="Ej: DOCENTE-001"
                autocomplete="off"
              />
            </IonItem>

            <IonItem lines="none" style={{ marginTop: '15px' }}>
              <IonIcon icon={keyOutline} slot="start" color="primary" />
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value || '')}
                placeholder="********"
              />
            </IonItem>

            {error && (
              <IonText color="danger">
                <p style={{ marginLeft: '16px', marginTop: '10px', fontSize: '14px' }}>{error}</p>
              </IonText>
            )}

            <IonButton 
              expand="block" 
              onClick={handleLogin}
              disabled={loading}
              style={{ marginTop: '25px', height: '48px' }}
            >
              <IonIcon slot="start" icon={logInOutline} />
              Iniciar sesión
            </IonButton>

            <IonButton 
              expand="block" 
              fill="clear" 
              onClick={fillDemoCredentials}
              style={{ marginTop: '10px' }}
            >
              Usar credenciales de prueba
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Footer */}
        <div className="ion-text-center" style={{ marginTop: '30px', color: '#999', fontSize: '12px' }}>
          <IonIcon icon={qrCodeOutline} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          Sistema de Asistencia por QR
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;