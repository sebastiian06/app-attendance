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
import { createSession, getSession, closeSession } from '../services/session';

const Session: React.FC = () => {
  const [session, setSession] = useState<any>(null);

  // 🔹 Obtener unidad seleccionada
  const unit = JSON.parse(localStorage.getItem('unit') || 'null');

  // 🔹 Mock de estudiantes inscritos
  const estudiantes = [
    { documento: 'EST-001', nombre: 'Juan' },
    { documento: 'EST-002', nombre: 'Maria' },
    { documento: 'EST-003', nombre: 'Carlos' }
  ];

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

  // 🔴 Validación: no hay unidad seleccionada
  if (!unit) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Sesión QR</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <IonText color="danger">
            <p>Debe seleccionar una unidad antes de crear la sesión</p>
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

        {/* 🔹 Información de la unidad */}
        <IonText>
          <h2>Unidad seleccionada</h2>
          <p><strong>{unit.nombre}</strong></p>
        </IonText>

        {/* 🔹 Lista de estudiantes */}
        <div style={{ marginTop: '20px' }}>
          <h3>Estudiantes inscritos</h3>
          <ul>
            {estudiantes.map((e) => (
              <li key={e.documento}>
                {e.nombre} ({e.documento})
              </li>
            ))}
          </ul>
        </div>

        {/* 🔹 Crear sesión */}
        {!session ? (
          <IonButton expand="block" onClick={handleCreate}>
            Crear sesión
          </IonButton>
        ) : (
          <>
            <div style={{ marginTop: '20px' }}>
              <h2>Sesión activa</h2>
              <p><strong>ID:</strong> {session.id}</p>
              <p><strong>QR Token:</strong> {session.qrToken}</p>
            </div>

            {/* 🔹 QR */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <QRCodeCanvas
                value={`http://localhost:5173/attendance/${session.qrToken}`}
                size={200}
              />
            </div>

            <IonButton
              color="danger"
              expand="block"
              onClick={handleClose}
              style={{ marginTop: '20px' }}
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