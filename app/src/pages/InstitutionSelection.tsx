// app/src/pages/InstitutionSelection.tsx
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonLoading,
  IonText,
  IonButton,
  IonIcon,
  IonCard,
  IonBadge,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { businessOutline, schoolOutline, refreshOutline } from 'ionicons/icons';
import { getInstitutions } from '../services/api';

interface Institution {
  _id: string;
  code: string;
  name: string;
  context: string;
  labels: string[];
  active: boolean;
}

const InstitutionSelection: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.replace('/login');
      return;
    }
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInstitutions();
      let institutionsArray: Institution[] = [];
      
      if (Array.isArray(data)) {
        institutionsArray = data;
      } else if (data && Array.isArray(data.data)) {
        institutionsArray = data.data;
      } else if (data && Array.isArray(data.institutions)) {
        institutionsArray = data.institutions;
      }
      
      setInstitutions(institutionsArray);
    } catch (err: any) {
      setError(err.message || 'No se pudieron cargar las instituciones');
    } finally {
      setLoading(false);
    }
  };

  const selectInstitution = (institution: Institution) => {
    localStorage.setItem('selectedInstitution', JSON.stringify(institution));
    history.push('/units');
  };

  const getInstitutionIcon = (context: string) => {
    return context === 'university' ? schoolOutline : businessOutline;
  };

  const getInstitutionColor = (code: string) => {
    switch (code) {
      case 'SENA':
        return 'success';
      case 'CORHUILA':
        return 'primary';
      default:
        return 'medium';
    }
  };

  const handleRefresh = (event: CustomEvent) => {
    loadInstitutions();
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
  };

  const goToLogin = () => {
    localStorage.clear();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Seleccionar Institución</IonTitle>
          <IonButton slot="end" fill="clear" onClick={goToLogin}>
            Cerrar Sesión
          </IonButton>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent pullingIcon={refreshOutline} pullingText="Desliza para actualizar" />
        </IonRefresher>

        <IonLoading isOpen={loading} message="Cargando instituciones..." />

        {/* CONTENIDO CENTRADO */}
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          
          {/* Título centrado */}
          <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
            <h2 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '8px' }}>
              Selecciona tu Institución
            </h2>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Elige la institución donde deseas trabajar
            </p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <IonText color="danger">
              <p style={{ textAlign: 'center' }}>{error}</p>
            </IonText>
          )}

          {/* Lista de instituciones centrada */}
          {!loading && !error && (
            <>
              {institutions.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                  <IonText color="warning">
                    <p>No hay instituciones disponibles</p>
                  </IonText>
                  <IonButton fill="clear" onClick={loadInstitutions}>
                    Reintentar
                  </IonButton>
                </div>
              ) : (
                <div style={{ padding: '0 16px' }}>
                  {institutions.map((institution) => (
                    <IonCard 
                      key={institution._id} 
                      style={{ 
                        margin: '12px 0', 
                        borderRadius: '16px',
                        cursor: 'pointer'
                      }}
                      onClick={() => selectInstitution(institution)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', padding: '12px' }}>
                        <IonIcon 
                          icon={getInstitutionIcon(institution.context)} 
                          color={getInstitutionColor(institution.code)}
                          style={{ fontSize: '40px', marginRight: '16px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold' }}>
                            {institution.name}
                          </h3>
                          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                            Código: {institution.code}
                          </p>
                          <IonBadge color={institution.code === 'SENA' ? 'success' : 'primary'}>
                            {institution.context === 'university' ? 'Universidad' : 'Institución Técnica'}
                          </IonBadge>
                        </div>
                        <IonIcon icon={businessOutline} style={{ fontSize: '24px', color: '#ccc' }} />
                      </div>
                    </IonCard>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default InstitutionSelection;