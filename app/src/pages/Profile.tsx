// app/src/pages/Profile.tsx
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonAvatar,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
  IonChip
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { personCircle, logOutOutline, schoolOutline, checkmarkCircleOutline, timeOutline } from 'ionicons/icons';
import { logout } from '../services/api';

const Profile: React.FC = () => {
  const history = useHistory();
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : { documento: 'DOCENTE-001', name: 'Profesor Demo' };
  const institutionJson = localStorage.getItem('selectedInstitution');
  const institution = institutionJson ? JSON.parse(institutionJson) : null;

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Avatar y nombre */}
        <div className="ion-text-center" style={{ marginBottom: '20px' }}>
          <IonAvatar style={{ width: '100px', height: '100px', margin: '0 auto', background: '#4CAF50' }}>
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              {user.name?.charAt(0).toUpperCase() || 'D'}
            </div>
          </IonAvatar>
          <h2 style={{ marginTop: '10px', marginBottom: '5px' }}>{user.name || 'Docente'}</h2>
          <IonChip color="primary">
            <IonIcon icon={checkmarkCircleOutline} />
            <IonLabel>Docente</IonLabel>
          </IonChip>
        </div>

        {/* Información personal */}
        <IonCard>
          <IonCardContent>
            <h3>Información Personal</h3>
            <IonItem lines="none">
              <IonIcon icon={personCircle} slot="start" color="primary" />
              <IonLabel>
                <h2>Documento</h2>
                <p>{user.documento}</p>
              </IonLabel>
            </IonItem>

            {institution && (
              <IonItem lines="none">
                <IonIcon icon={schoolOutline} slot="start" color="secondary" />
                <IonLabel>
                  <h2>Institución Actual</h2>
                  <p>{institution.name}</p>
                </IonLabel>
              </IonItem>
            )}
          </IonCardContent>
        </IonCard>

        {/* Estadísticas */}
        <IonCard>
          <IonCardContent>
            <h3>Estadísticas Rápidas</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <IonIcon icon={timeOutline} style={{ fontSize: '28px', color: '#4CAF50' }} />
                <h4 id="sessionsCount">0</h4>
                <p>Sesiones</p>
              </div>
              <div>
                <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '28px', color: '#2196F3' }} />
                <h4 id="studentsCount">0</h4>
                <p>Estudiantes</p>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Botones */}
        <IonButton expand="block" color="danger" onClick={handleLogout} style={{ marginTop: '20px' }}>
          <IonIcon slot="start" icon={logOutOutline} />
          Cerrar Sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Profile;