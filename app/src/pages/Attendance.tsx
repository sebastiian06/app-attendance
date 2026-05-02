// app/src/pages/Attendance.tsx
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
  IonCard,
  IonCardContent,
  IonIcon,
  IonAlert
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { checkmarkCircleOutline, closeCircleOutline, qrCodeOutline } from 'ionicons/icons';
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
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      console.log('📡 Registrando asistencia:', { token, documento });
      
      const response = await registerAttendance(token, documento);
      
      console.log('✅ Respuesta:', response);
      
      setMessage({
        type: 'success',
        text: response.message || '¡Asistencia registrada exitosamente!'
      });
      setRegistered(true);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      
    } catch (err: any) {
      console.error('❌ Error registrando asistencia:', err);
      
      let errorMessage = 'Error al registrar asistencia';
      
      if (err.message.includes('no pertenece')) {
        errorMessage = 'Este documento no pertenece a la unidad académica';
      } else if (err.message.includes('ya registró')) {
        errorMessage = 'Ya registró su asistencia anteriormente';
      } else if (err.message.includes('expirada')) {
        errorMessage = 'La sesión ha expirado';
      } else if (err.message.includes('No hay sesión')) {
        errorMessage = 'No hay una sesión activa';
      } else {
        errorMessage = err.message || 'Error al registrar asistencia';
      }
      
      setMessage({
        type: 'error',
        text: errorMessage
      });
      
      // Limpiar mensaje después de 3 segundos
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
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro de Asistencia</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message="Registrando asistencia..." />

        {/* Logo o ícono */}
        <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
          <IonIcon 
            icon={qrCodeOutline} 
            style={{ fontSize: '80px', color: '#3880ff' }} 
          />
          <h2>Registro de Asistencia</h2>
          <p>Escanea el código QR para registrar tu asistencia</p>
        </div>

        {/* Mensaje de éxito/error */}
        {message && (
          <IonCard color={message.type === 'success' ? 'success' : 'danger'}>
            <IonCardContent style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IonIcon 
                icon={message.type === 'success' ? checkmarkCircleOutline : closeCircleOutline} 
                style={{ fontSize: '24px' }}
              />
              <span>{message.text}</span>
            </IonCardContent>
          </IonCard>
        )}

        {/* Formulario de registro */}
        {!registered ? (
          <IonCard>
            <IonCardContent>
              <h3>Registrar Asistencia</h3>
              
              <IonItem>
                <IonLabel position="stacked">Número de Documento</IonLabel>
                <IonInput
                  type="text"
                  value={documento}
                  onIonChange={(e) => setDocumento(e.detail.value || '')}
                  placeholder="Ej: EST-001, APR-001, 12345678"
                  autocomplete="off"
                  disabled={loading}
                />
              </IonItem>

              <IonButton 
                expand="block" 
                onClick={handleRegister}
                disabled={loading || !documento.trim()}
                style={{ marginTop: '20px' }}
              >
                Registrar Asistencia
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : (
          <IonCard color="success">
            <IonCardContent style={{ textAlign: 'center' }}>
              <IonIcon 
                icon={checkmarkCircleOutline} 
                style={{ fontSize: '60px', marginBottom: '10px' }} 
              />
              <h3>¡Asistencia Registrada!</h3>
              <p>Su asistencia ha sido registrada exitosamente.</p>
              <IonButton expand="block" fill="outline" onClick={handleReset}>
                Registrar otra asistencia
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {/* Información adicional */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#666' }}>
          <p>Sistema de Asistencia Académica</p>
          <p>Si tiene problemas, consulte con su instructor</p>
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