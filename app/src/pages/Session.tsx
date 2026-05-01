import { QRCodeCanvas } from 'qrcode.react';
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
import {
  createSession,
  getSession,
  closeSession,
  isSessionExpired
} from '../services/session';

const Session: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const unit = JSON.parse(localStorage.getItem('unit') || 'null');

  const estudiantes = [
    { documento: 'EST-001', nombre: 'Juan' },
    { documento: 'EST-002', nombre: 'Maria' },
    { documento: 'EST-003', nombre: 'Carlos' }
  ];

  useEffect(() => {
    const existing = getSession();
    if (existing) setSession(existing);
  }, []);

  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(session.expiresAt).getTime();

      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const handleCreate = () => {
    if (session && !isSessionExpired(session)) {
      alert('Ya hay una sesión activa');
      return;
    }

    const newSession = createSession();
    setSession(newSession);
  };

  const handleClose = () => {
    closeSession();
    setSession(null);
  };

  if (!unit) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonText color="danger">
            <p>Debe seleccionar una unidad primero</p>
          </IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sesión QR</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <h2>{unit.nombre}</h2>

        <h3>Estudiantes inscritos</h3>
        <ul>
          {estudiantes.map(e => (
            <li key={e.documento}>
              {e.nombre} ({e.documento})
            </li>
          ))}
        </ul>

        {!session ? (
          <IonButton expand="block" onClick={handleCreate}>
            Crear sesión
          </IonButton>
        ) : (
          <>
            <h2>Sesión activa</h2>

            <p><strong>ID:</strong> {session.id}</p>
            <p><strong>Token:</strong> {session.qrToken}</p>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <QRCodeCanvas
                value={`http://localhost:5173/attendance/${session.qrToken}`}
                size={200}
              />
            </div>

            <p>
              <strong>Estado:</strong>{' '}
              {isSessionExpired(session) ? 'Expirado' : 'Activo'}
            </p>

            <p>
              <strong>Tiempo restante:</strong> {timeLeft}s
            </p>

            <IonButton
              color="danger"
              expand="block"
              onClick={handleClose}
            >
              Cerrar sesión
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Session;