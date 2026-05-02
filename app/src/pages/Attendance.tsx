// app/src/pages/Attendance.tsx
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonIcon,
  IonLoading,
  IonAlert
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  checkmarkCircleOutline, 
  closeCircleOutline, 
  qrCodeOutline, 
  personOutline, 
  logInOutline,
  ticketOutline
} from 'ionicons/icons';
import { registerAttendance } from '../services/api';

interface AttendanceParams {
  token: string;
}

const Attendance: React.FC = () => {
  const { token } = useParams<AttendanceParams>();
  const [documento, setDocumento] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [registered, setRegistered] = useState(false);
  const [studentName, setStudentName] = useState('');
  const history = useHistory();

  useEffect(() => {
    console.log('🔍 Token recibido:', token);
    
    if (!token) {
      setAlertMessage('Token de sesión inválido');
      setShowAlert(true);
    }
  }, [token]);

  const handleRegister = async () => {
    if (!documento.trim()) {
      setMessage({
        type: 'error',
        text: 'Por favor ingrese su número de documento'
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      console.log('📡 Registrando asistencia:', { token, documento });
      
      const response = await registerAttendance(token, documento);
      
      console.log('✅ Respuesta:', response);
      
      setStudentName(response.data?.nombre || 'Estudiante');
      setMessage({
        type: 'success',
        text: response.message || '¡Asistencia registrada exitosamente!'
      });
      setRegistered(true);
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      
    } catch (err: any) {
      console.error('❌ Error registrando asistencia:', err);
      
      let errorMessage = 'Error al registrar asistencia';
      
      if (err.message.includes('no pertenece')) {
        errorMessage = '❌ Este documento no pertenece a esta unidad académica';
      } else if (err.message.includes('ya registró')) {
        errorMessage = '⚠️ Ya registró su asistencia anteriormente';
      } else if (err.message.includes('expirada')) {
        errorMessage = '⏰ La sesión ha expirado';
      } else if (err.message.includes('No hay sesión')) {
        errorMessage = '📱 No hay una sesión activa';
      } else {
        errorMessage = err.message || 'Error al registrar asistencia';
      }
      
      setMessage({
        type: 'error',
        text: errorMessage
      });
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDocumento('');
    setRegistered(false);
    setMessage(null);
    setStudentName('');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro de Asistencia</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f5f7fa' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: 'calc(100vh - 56px)',
          width: '100%'
        }}>
          
          <div style={{ 
            maxWidth: '450px', 
            width: '100%',
            padding: '0 16px'
          }}>
            
            <IonLoading isOpen={loading} message="Registrando asistencia..." />

            {/* Logo o ícono */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
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
                <IonIcon icon={qrCodeOutline} style={{ fontSize: '45px', color: 'white' }} />
              </div>
              <h2 style={{ marginTop: '20px', marginBottom: '8px', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                Registrar Asistencia
              </h2>
              <p style={{ color: '#666', marginTop: '0', fontSize: '14px' }}>
                Escanea el código QR para registrar tu asistencia
              </p>
            </div>

            {/* Token de sesión */}
            {token && (
              <div style={{ 
                backgroundColor: '#f0f2f5', 
                borderRadius: '12px', 
                padding: '10px 16px',
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <IonIcon icon={ticketOutline} style={{ fontSize: '16px', color: '#666' }} />
                  <span style={{ fontSize: '12px', color: '#666' }}>Token de sesión:</span>
                  <code style={{ fontSize: '13px', fontWeight: 'bold', color: '#4CAF50' }}>{token}</code>
                </div>
              </div>
            )}

            {/* Mensaje de éxito/error */}
            {message && (
              <div style={{ 
                backgroundColor: message.type === 'success' ? '#E8F5E9' : '#FFEBEE',
                padding: '16px',
                borderRadius: '14px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderLeft: `4px solid ${message.type === 'success' ? '#4CAF50' : '#F44336'}`
              }}>
                <IonIcon 
                  icon={message.type === 'success' ? checkmarkCircleOutline : closeCircleOutline} 
                  style={{ fontSize: '24px', color: message.type === 'success' ? '#4CAF50' : '#F44336' }}
                />
                <span style={{ fontSize: '14px', color: '#333', flex: 1 }}>{message.text}</span>
              </div>
            )}

            {/* Formulario de registro */}
            {!registered ? (
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '24px', 
                padding: '28px 24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                
                {/* Campo Documento */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '8px' }}>
                    <IonIcon icon={personOutline} style={{ fontSize: '18px', color: '#4CAF50' }} />
                    <span style={{ fontWeight: '500', fontSize: '14px', color: '#333' }}>Número de Documento</span>
                  </div>
                  <div style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '14px',
                    backgroundColor: 'white'
                  }}>
                    <IonInput
                      type="text"
                      value={documento}
                      onIonChange={(e) => setDocumento(e.detail.value || '')}
                      placeholder="Ej: EST-001, APR-001, 12345678"
                      autocomplete="off"
                      disabled={loading}
                      style={{ 
                        '--padding-start': '16px', 
                        '--padding-end': '16px',
                        '--padding-top': '14px',
                        '--padding-bottom': '14px',
                        '--color': '#333',
                        '--placeholder-color': '#999',
                        '--placeholder-opacity': '1',
                        'background': 'white'
                      }}
                    />
                  </div>
                </div>

                {/* Botón Registrar */}
                <button
                  onClick={handleRegister}
                  disabled={loading || !documento.trim()}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#4CAF50',
                    border: 'none',
                    borderRadius: '14px',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: !loading && documento.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: !loading && documento.trim() ? 1 : 0.6
                  }}
                  onMouseEnter={(e) => {
                    if (documento.trim() && !loading) {
                      e.currentTarget.style.backgroundColor = '#43A047';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4CAF50';
                  }}
                >
                  <IonIcon icon={logInOutline} style={{ fontSize: '18px' }} />
                  Registrar Asistencia
                </button>
              </div>
            ) : (
              // Pantalla de éxito
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '24px', 
                padding: '32px 24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                textAlign: 'center'
              }}>
                <div style={{
                  backgroundColor: '#E8F5E9',
                  width: '70px',
                  height: '70px',
                  borderRadius: '35px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '40px', color: '#4CAF50' }} />
                </div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: 'bold', color: '#4CAF50' }}>
                  ¡Asistencia Registrada!
                </h3>
                <p style={{ color: '#666', marginBottom: '8px' }}>
                  Hola <strong>{studentName}</strong>
                </p>
                <p style={{ color: '#999', fontSize: '13px', marginBottom: '24px' }}>
                  Tu asistencia ha sido registrada exitosamente
                </p>
                <button
                  onClick={handleReset}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#4CAF50',
                    border: 'none',
                    borderRadius: '14px',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#43A047';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4CAF50';
                  }}
                >
                  Registrar otra asistencia
                </button>
              </div>
            )}

            {/* Información adicional */}
            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#999' }}>
              <p>Sistema de Asistencia Académica</p>
              <p>Si tiene problemas, consulte con su instructor</p>
            </div>
          </div>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
            history.push('/');
          }}
          header="Error"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Attendance;