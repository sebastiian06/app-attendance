// app/src/pages/Session.tsx
import { QRCodeCanvas } from 'qrcode.react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
  IonLoading,
  IonIcon,
  IonChip,
  IonCard,
  IonCardContent,
  IonButtons,
  IonBackButton,
  IonAlert
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { timeOutline, checkmarkCircleOutline, closeCircleOutline, refreshOutline } from 'ionicons/icons';
import { createSession as createSessionAPI, activateSession } from '../services/api';

const Session: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  // Obtener unidad e institución del localStorage
  const unitJson = localStorage.getItem('selectedUnit');
  const institutionJson = localStorage.getItem('selectedInstitution');
  const unit = unitJson ? JSON.parse(unitJson) : null;
  const institution = institutionJson ? JSON.parse(institutionJson) : null;

  // Verificar sesión existente en localStorage
  useEffect(() => {
    const existingSession = localStorage.getItem('currentSession');
    if (existingSession) {
      const parsed = JSON.parse(existingSession);
      const expires = new Date(parsed.expiresAt);
      const now = new Date();
      
      if (now < expires && parsed.status === 'active') {
        setSession(parsed);
        startCountdown(parsed.expiresAt);
      } else {
        localStorage.removeItem('currentSession');
      }
    }
  }, []);

  // Iniciar countdown
  const startCountdown = (expiresAt: string) => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeLeft(diff);
      
      if (diff === 0) {
        clearInterval(interval);
        setSession(null);
        localStorage.removeItem('currentSession');
        setAlertMessage('La sesión ha expirado');
        setShowAlert(true);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  };

  // Crear sesión
  const handleCreateSession = async () => {
    if (!unit || !institution) {
      setAlertMessage('Debe seleccionar una unidad e institución primero');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('📡 Creando sesión para:', { unitId: unit._id, institutionId: institution._id });
      
      const newSession = await createSessionAPI(unit._id, institution._id);
      console.log('✅ Sesión creada:', newSession);
      
      if (newSession && newSession._id) {
        setSession(newSession);
        localStorage.setItem('currentSession', JSON.stringify(newSession));
        startCountdown(newSession.expiresAt);
      } else {
        throw new Error('No se recibió una sesión válida');
      }
      
    } catch (err: any) {
      console.error('❌ Error creando sesión:', err);
      setError(err.message || 'Error al crear la sesión');
      setAlertMessage(err.message || 'Error al crear la sesión');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión manualmente
  const handleCloseSession = () => {
    setSession(null);
    localStorage.removeItem('currentSession');
    setTimeLeft(0);
  };

  // Ver resultados
  const goToResults = () => {
    if (session && session._id) {
      localStorage.setItem('currentSessionId', session._id);
      history.push('/results');
    }
  };

  // Regenerar sesión
  const handleRegenerate = () => {
    handleCloseSession();
    setTimeout(() => {
      handleCreateSession();
    }, 500);
  };

  // Validar unidad
  if (!unit) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/students" />
            </IonButtons>
            <IonTitle>Crear Sesión QR</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText color="danger">
            <p>Debe seleccionar una unidad primero</p>
          </IonText>
          <IonButton expand="block" onClick={() => history.push('/units')}>
            Seleccionar Unidad
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  // Formatear tiempo restante
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/students" />
          </IonButtons>
          <IonTitle>Sesión QR</IonTitle>
          <IonButtons slot="end">
            {session && (
              <IonButton onClick={goToResults}>
                Resultados
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message={session ? "Activando sesión..." : "Creando sesión..."} />

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        {/* Información de la unidad */}
        <IonCard>
          <IonCardContent>
            <h3>{unit.name}</h3>
            <p>Código: {unit.code}</p>
            <p>Institución: {institution?.name || 'No especificada'}</p>
          </IonCardContent>
        </IonCard>

        {/* Botón crear sesión */}
        {!session ? (
          <IonButton expand="block" onClick={handleCreateSession}>
            Crear Sesión con QR
          </IonButton>
        ) : (
          <>
            {/* Información de la sesión */}
            <IonCard>
              <IonCardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0 }}>Sesión Activa</h3>
                  <IonChip color={timeLeft > 0 ? 'success' : 'danger'}>
                    <IonIcon icon={timeLeft > 0 ? checkmarkCircleOutline : closeCircleOutline} />
                    <span style={{ marginLeft: '5px' }}>{timeLeft > 0 ? 'Activa' : 'Expirada'}</span>
                  </IonChip>
                </div>
                
                <p><strong>Token:</strong> <code>{session.qrToken}</code></p>
                {session.roomCode && (
                  <p><strong>Código de sala:</strong> <code style={{ fontSize: '24px', fontWeight: 'bold' }}>{session.roomCode}</code></p>
                )}
                <p><strong>Tiempo restante:</strong> {formatTimeLeft()}</p>
              </IonCardContent>
            </IonCard>

            {/* Código QR */}
            <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 20 }}>
              <QRCodeCanvas
                value={`http://localhost:5173/attendance/${session.qrToken}`}
                size={200}
              />
              <p style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
                Escanea el QR para registrar asistencia
              </p>
            </div>

            {/* Botones de acción */}
            <IonButton 
              expand="block" 
              color="danger" 
              onClick={handleCloseSession}
              disabled={timeLeft === 0}
            >
              Cerrar Sesión
            </IonButton>
            
            <IonButton 
              expand="block" 
              fill="outline" 
              onClick={handleRegenerate}
            >
              <IonIcon slot="start" icon={refreshOutline} />
              Regenerar QR
            </IonButton>
          </>
        )}

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Información"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Session;