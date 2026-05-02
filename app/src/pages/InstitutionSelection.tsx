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
  IonRefresher,
  IonRefresherContent,
  IonAlert
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
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Verificar si hay token
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No hay token, redirigiendo a login');
      history.replace('/login');
      return;
    }
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Cargando instituciones...');
      
      const data = await getInstitutions();
      console.log('📊 Datos recibidos:', data);
      
      // Manejar diferentes formatos de respuesta
      let institutionsArray: Institution[] = [];
      
      if (Array.isArray(data)) {
        institutionsArray = data;
      } else if (data && Array.isArray(data.data)) {
        institutionsArray = data.data;
      } else if (data && Array.isArray(data.institutions)) {
        institutionsArray = data.institutions;
      } else if (data && typeof data === 'object') {
        // Si es un objeto, intentar extraer valores
        institutionsArray = Object.values(data).filter(item => 
          item && typeof item === 'object' && 'code' in item && 'name' in item
        ) as Institution[];
      }
      
      console.log('📊 Instituciones procesadas:', institutionsArray.length);
      setInstitutions(institutionsArray);
      
      if (institutionsArray.length === 0) {
        setAlertMessage('No hay instituciones disponibles. Por favor, ejecute el seed en el backend.');
        setShowAlert(true);
      }
      
    } catch (err: any) {
      console.error('❌ Error cargando instituciones:', err);
      setError(err.message || 'No se pudieron cargar las instituciones');
      setAlertMessage(err.message || 'Error al cargar las instituciones');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const selectInstitution = (institution: Institution) => {
    console.log('📚 Institución seleccionada:', institution);
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
          <IonRefresherContent pullingIcon={refreshOutline} pullingText="Desliza para actualizar" refreshingSpinner="circles" />
        </IonRefresher>

        <IonLoading isOpen={loading} message="Cargando instituciones..." />

        {error && (
          <IonText color="danger">
            <p style={{ textAlign: 'center', margin: '20px' }}>{error}</p>
          </IonText>
        )}

        {!loading && !error && institutions.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <IonText color="warning">
              <h3>No hay instituciones disponibles</h3>
              <p>Por favor, asegúrate de:</p>
              <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                <li>El backend está corriendo en puerto 4000</li>
                <li>MongoDB está conectado</li>
                <li>Ejecutaste el seed: npx ts-node src/scripts/seed.ts</li>
              </ul>
            </IonText>
            <IonButton expand="block" onClick={loadInstitutions} style={{ marginTop: '20px' }}>
              Reintentar
            </IonButton>
          </div>
        )}

        <IonList>
          {institutions.map((institution) => (
            <IonItem 
              key={institution._id} 
              button 
              onClick={() => selectInstitution(institution)}
              detail={true}
            >
              <IonIcon 
                icon={getInstitutionIcon(institution.context)} 
                slot="start" 
                color={getInstitutionColor(institution.code)}
                style={{ fontSize: '28px' }}
              />
              <IonLabel>
                <h2 style={{ fontWeight: 'bold' }}>{institution.name}</h2>
                <p>Código: {institution.code}</p>
                <p style={{ fontSize: '12px', marginTop: '5px' }}>
                  {institution.context === 'university' ? 'Universidad' : 'Institución Técnica'}
                </p>
                {institution.labels && institution.labels.length > 0 && (
                  <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                    {institution.labels.map((label, idx) => (
                      <span key={idx} style={{ 
                        backgroundColor: '#e0e0e0', 
                        padding: '2px 8px', 
                        borderRadius: '12px',
                        fontSize: '10px'
                      }}>
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Información"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default InstitutionSelection;