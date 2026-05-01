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
  IonText
} from '@ionic/react';
import { useState } from 'react';
import { login } from '../services/api';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [documento, setDocumento] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const handleLogin = async () => {
    try {
      setError('');
      await login(documento, password);

      // 🔹 Redirección
      history.push('/units');

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login Docente</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Documento</IonLabel>
          <IonInput
            value={documento}
            onIonChange={(e) => setDocumento(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Contraseña</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        <IonButton expand="block" onClick={handleLogin}>
          Iniciar sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;