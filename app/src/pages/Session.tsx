// app/src/pages/Session.tsx
import { QRCodeCanvas } from 'qrcode.react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonLoading,
  IonText,
  IonIcon,
  IonChip,
  IonCard,
  IonCardContent,
  IonAlert,
  IonButton
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  timeOutline, 
  checkmarkCircleOutline, 
  closeCircleOutline, 
  refreshOutline, 
  qrCodeOutline,
  peopleOutline,
  hourglassOutline
} from 'ionicons/icons';
import { createSession as createSessionAPI } from '../services/api';

const Session: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

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

  const handleCloseSession = () => {
    setSession(null);
    localStorage.removeItem('currentSession');
    setTimeLeft(0);
  };

  const goToResults = () => {
    if (session && session._id) {
      localStorage.setItem('currentSessionId', session._id);
      history.push('/results');
    }
  };

  const handleRegenerate = () => {
    handleCloseSession();
    setTimeout(() => {
      handleCreateSession();
    }, 500);
  };

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <IonText color="danger">
              <p>Debe seleccionar una unidad primero</p>
            </IonText>
            <IonButton expand="block" onClick={() => history.push('/units')}>
              Seleccionar Unidad
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/students" />
          </IonButtons>
          <IonTitle>Sesión QR</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f5f7fa' }}>
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          width: '100%'
        }}>
          
          {/* Título centrado */}
          <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>
            <h2 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '8px', margin: 0 }}>
              Sesión de Asistencia
            </h2>
            <p style={{ color: '#666', fontSize: '14px', margin: '5px 0 0 0' }}>
              Genera un código QR para tomar asistencia
            </p>
          </div>

          <IonLoading isOpen={loading} message={session ? "Activando sesión..." : "Creando sesión..."} />

          {error && (
            <IonText color="danger">
              <p style={{ textAlign: 'center' }}>{error}</p>
            </IonText>
          )}

          {/* Información de la unidad */}
          <div style={{ 
            backgroundColor: '#E8F5E9', 
            padding: '12px 16px', 
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0 }}>
              <strong>{unit?.name}</strong>
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
              {institution?.name}
            </p>
          </div>

          {/* Botón crear sesión centrado */}
          {!session ? (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={handleCreateSession}
                style={{
                  padding: '14px 28px',
                  backgroundColor: '#4CAF50',
                  border: 'none',
                  borderRadius: '14px',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#43A047';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#4CAF50';
                }}
              >
                <IonIcon icon={qrCodeOutline} style={{ fontSize: '18px' }} />
                Crear Sesión con QR
              </button>
            </div>
          ) : (
            <>
              {/* Tarjeta de información */}
              <IonCard style={{ borderRadius: '16px', marginBottom: '20px' }}>
                <IonCardContent style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                    <IonChip color={timeLeft > 0 ? 'success' : 'danger'}>
                      <IonIcon icon={timeLeft > 0 ? checkmarkCircleOutline : closeCircleOutline} />
                      <span style={{ marginLeft: '5px' }}>
                        {timeLeft > 0 ? 'Sesión Activa' : 'Expirada'}
                      </span>
                    </IonChip>
                  </div>
                  
                  <div style={{ 
                    backgroundColor: '#F5F5F5', 
                    padding: '10px', 
                    borderRadius: '8px',
                    marginBottom: '15px'
                  }}>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Token de sesión</p>
                    <code style={{ fontSize: '16px', fontWeight: 'bold' }}>{session.qrToken}</code>
                  </div>
                  
                  {session.roomCode && (
                    <div style={{ 
                      backgroundColor: '#E8F5E9', 
                      padding: '10px', 
                      borderRadius: '8px',
                      marginBottom: '15px'
                    }}>
                      <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Código de sala</p>
                      <strong style={{ fontSize: '28px', color: '#4CAF50' }}>{session.roomCode}</strong>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <IonIcon icon={hourglassOutline} color="medium" />
                    <p style={{ margin: 0 }}>
                      <strong>Tiempo restante:</strong> {formatTimeLeft()}
                    </p>
                  </div>
                </IonCardContent>
              </IonCard>

              {/* Código QR centrado */}
              <div style={{ 
                textAlign: 'center', 
                marginTop: 20, 
                marginBottom: 20,
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '20px',
                width: 'fit-content',
                margin: '0 auto 20px auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <QRCodeCanvas
                  value={`http://localhost:5173/attendance/${session.qrToken}`}
                  size={200}
                />
                <p style={{ marginTop: 15, fontSize: 12, color: '#666' }}>
                  📱 Escanea el QR para registrar asistencia
                </p>
              </div>

              {/* Botones centrados uno al lado del otro */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '12px',
                marginTop: '24px',
                flexWrap: 'wrap'
              }}>
                {/* Botón Cerrar Sesión */}
                <button
                  onClick={handleCloseSession}
                  disabled={timeLeft === 0}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#F44336',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: timeLeft !== 0 ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: timeLeft !== 0 ? 1 : 0.5,
                    minWidth: '120px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (timeLeft !== 0) {
                      e.currentTarget.style.backgroundColor = '#D32F2F';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F44336';
                  }}
                >
                  <IonIcon icon={closeCircleOutline} style={{ fontSize: '18px' }} />
                  Cerrar Sesión
                </button>

                {/* Botón Regenerar QR */}
                <button
                  onClick={handleRegenerate}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#FF9800',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minWidth: '120px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F57C00';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF9800';
                  }}
                >
                  <IonIcon icon={refreshOutline} style={{ fontSize: '18px' }} />
                  Regenerar QR
                </button>

                {/* Botón Ver Resultados */}
                <button
                  onClick={goToResults}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#2196F3',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minWidth: '120px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1976D2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2196F3';
                  }}
                >
                  <IonIcon icon={peopleOutline} style={{ fontSize: '18px' }} />
                  Ver Resultados
                </button>
              </div>
            </>
          )}
        </div>

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