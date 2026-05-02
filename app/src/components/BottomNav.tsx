// app/src/components/BottomNav.tsx
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { homeOutline, businessOutline, bookOutline, qrCodeOutline, personOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';

interface BottomNavProps {
  role?: string;
}

const BottomNav: React.FC<BottomNavProps> = () => {
  const history = useHistory();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/institutions') return 'institutions';
    if (path === '/units') return 'units';
    if (path === '/students') return 'students';
    if (path === '/session') return 'session';
    if (path === '/profile') return 'profile';
    return 'institutions';
  };

  const activeTab = getActiveTab();

  return (
    <IonTabBar slot="bottom">
      <IonTabButton
        tab="institutions"
        href="/institutions"
        selected={activeTab === 'institutions'}
      >
        <IonIcon icon={businessOutline} />
        <IonLabel>Institución</IonLabel>
      </IonTabButton>

      <IonTabButton
        tab="units"
        href="/units"
        selected={activeTab === 'units'}
      >
        <IonIcon icon={bookOutline} />
        <IonLabel>Materia</IonLabel>
      </IonTabButton>

      <IonTabButton
        tab="students"
        href="/students"
        selected={activeTab === 'students'}
      >
        <IonIcon icon={homeOutline} />
        <IonLabel>Estudiantes</IonLabel>
      </IonTabButton>

      <IonTabButton
        tab="session"
        href="/session"
        selected={activeTab === 'session'}
      >
        <IonIcon icon={qrCodeOutline} />
        <IonLabel>Sesión</IonLabel>
      </IonTabButton>

      <IonTabButton
        tab="profile"
        href="/profile"
        selected={activeTab === 'profile'}
      >
        <IonIcon icon={personOutline} />
        <IonLabel>Perfil</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default BottomNav;