import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonText
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { registerAttendance } from '../services/attendance';

const Attendance: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [documento, setDocumento] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleRegister = () => {
  if (!documento) {
    setMensaje('Ingrese su documento');
    return;
  }

  const result = registerAttendance(token, documento);

  if (result.status === 'ACCEPTED') {
    setMensaje('Asistencia registrada correctamente');
  } else {
    setMensaje(result.reason || 'Error en el registro');
  }
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro de Asistencia</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText>
          <p><strong>Token:</strong> {token}</p>
        </IonText>

        <IonItem>
          <IonLabel position="stacked">Documento</IonLabel>
          <IonInput
            value={documento}
            onIonChange={(e) => setDocumento(e.detail.value!)}
          />
        </IonItem>

        <IonButton expand="block" onClick={handleRegister}>
          Registrar asistencia
        </IonButton>

        {mensaje && (
          <IonText color="success">
            <p>{mensaje}</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Attendance;