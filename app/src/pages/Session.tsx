import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { createSession, getSession, closeSession } from '../services/session';

const Session: React.FC = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const existing = getSession();
    if (existing) {
      setSession(existing);
    }
  }, []);

  const handleCreate = () => {
    const newSession = createSession();
    setSession(newSession);
  };

  const handleClose = () => {
    closeSession();
    setSession(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sesión QR</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {!session ? (
          <IonButton expand="block" onClick={handleCreate}>
            Crear sesión
          </IonButton>
        ) : (
          <>
            <IonText>
              <h2>Sesión activa</h2>
              <p><strong>ID:</strong> {session.id}</p>
              <p><strong>QR Token:</strong> {session.qrToken}</p>
            </IonText>

            <IonButton color="danger" expand="block" onClick={handleClose}>
              Cerrar sesión
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Session;