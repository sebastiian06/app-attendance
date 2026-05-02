// app/src/pages/UnitSelection.tsx
import {
  IonContent,
  IonPage,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonButtons,
  IonBackButton,
  IonLoading,
  IonText,
  IonCard,
  IonCardContent,
  IonIcon,
  IonBadge,
  IonButton
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { bookOutline, schoolOutline, chevronForwardOutline } from 'ionicons/icons';
import { getAcademicUnits } from '../services/api';

interface Institution {
  _id: string;
  code: string;
  name: string;
  context: string;
}

interface AcademicUnit {
  _id: string;
  code: string;
  name: string;
  type: 'ficha' | 'materia';
  active: boolean;
}

const UnitSelection: React.FC = () => {
  const [units, setUnits] = useState<AcademicUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();
  
  const institutionJson = localStorage.getItem('selectedInstitution');
  const institution: Institution | null = institutionJson ? JSON.parse(institutionJson) : null;

  useEffect(() => {
    if (!institution) {
      history.replace('/institutions');
      return;
    }
    loadUnits();
  }, []);

  const loadUnits = async () => {
    if (!institution) return;
    
    try {
      setLoading(true);
      setError(null);
      const institutionId = institution._id;
      const data = await getAcademicUnits(institutionId);
      
      let unitsArray: AcademicUnit[] = [];
      if (Array.isArray(data)) {
        unitsArray = data;
      } else if (data && Array.isArray(data.units)) {
        unitsArray = data.units;
      }
      
      setUnits(unitsArray);
    } catch (err: any) {
      setError(err.message || 'No se pudieron cargar las unidades');
    } finally {
      setLoading(false);
    }
  };

  const selectUnit = (unit: AcademicUnit) => {
    localStorage.setItem('selectedUnit', JSON.stringify(unit));
    history.push('/students');
  };

  if (!institution) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/institutions" />
            </IonButtons>
            <IonTitle>Unidades</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <IonText color="danger">
              <p>No hay institución seleccionada</p>
            </IonText>
            <IonButton expand="block" onClick={() => history.push('/institutions')}>
              Seleccionar Institución
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/institutions" />
          </IonButtons>
          <IonTitle>{institution.code === 'SENA' ? 'Fichas' : 'Materias'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          
          <IonLoading isOpen={loading} message="Cargando unidades..." />

          {/* Título centrado */}
          <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
            <h2 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '8px' }}>
              {institution.code === 'SENA' ? 'Selecciona tu Ficha' : 'Selecciona tu Materia'}
            </h2>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              backgroundColor: '#E8F5E9',
              padding: '8px 16px',
              borderRadius: '20px'
            }}>
              <IonIcon icon={schoolOutline} color="primary" />
              <span style={{ fontSize: '14px' }}>{institution.name}</span>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div style={{ 
              backgroundColor: '#ffebee', 
              padding: '12px', 
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <IonText color="danger">
                <p style={{ margin: 0 }}>{error}</p>
              </IonText>
            </div>
          )}

          {/* Lista de unidades - estilo tarjetas uniformes */}
          {!loading && !error && (
            <>
              {units.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                  <IonIcon icon={bookOutline} style={{ fontSize: '64px', opacity: 0.5 }} />
                  <IonText color="warning">
                    <p>No hay {institution.code === 'SENA' ? 'fichas' : 'materias'} disponibles</p>
                  </IonText>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {units.map((unit) => (
                    <div
                      key={unit._id}
                      onClick={() => selectUnit(unit)}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '16px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        border: '1px solid #f0f0f0'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            backgroundColor: unit.type === 'ficha' ? '#E8F5E9' : '#E3F2FD',
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <IonIcon 
                              icon={bookOutline} 
                              style={{ fontSize: '24px', color: unit.type === 'ficha' ? '#4CAF50' : '#2196F3' }} 
                            />
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                              {unit.name}
                            </h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
                              Código: {unit.code}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <IonBadge color={unit.type === 'ficha' ? 'success' : 'primary'}>
                            {unit.type === 'ficha' ? 'Ficha' : 'Materia'}
                          </IonBadge>
                          <IonIcon icon={chevronForwardOutline} style={{ fontSize: '20px', color: '#ccc' }} />
                        </div>
                      </div>
                    </div>
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

export default UnitSelection;