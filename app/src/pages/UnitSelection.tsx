// app/src/pages/UnitSelection.tsx
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonButtons,
  IonBackButton,
  IonLoading,
  IonText,
  IonChip,
  IonButton
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getAcademicUnits } from '../services/api';

// Definir la interfaz localmente para evitar errores de importación
interface Institution {
  _id: string;
  id?: string;
  code: string;
  name: string;
  context: string;
  labels: string[];
  active: boolean;
}

interface AcademicUnit {
  _id: string;
  id?: string;
  institutionId: string | Institution;
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
  
  // Obtener la institución seleccionada del localStorage
  const institutionJson = localStorage.getItem('selectedInstitution');
  const institution: Institution | null = institutionJson ? JSON.parse(institutionJson) : null;

  useEffect(() => {
    // Verificar si hay institución seleccionada
    if (!institution) {
      console.log('No hay institución seleccionada, redirigiendo...');
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
      
      // Obtener el ID correctamente (puede ser _id o id)
      const institutionId = institution._id || institution.id;
      
      console.log('📚 Cargando unidades para institución:', {
        id: institutionId,
        name: institution.name,
        code: institution.code
      });
      
      if (!institutionId) {
        throw new Error('ID de institución no válido');
      }
      
      const data = await getAcademicUnits(institutionId);
      
      console.log('✅ Unidades cargadas:', data);
      
      // Asegurar que data es un array
      if (Array.isArray(data)) {
        setUnits(data);
      } else if (data && Array.isArray(data.units)) {
        setUnits(data.units);
      } else {
        setUnits([]);
      }
      
    } catch (err: any) {
      console.error('❌ Error cargando unidades:', err);
      setError(err.message || 'No se pudieron cargar las unidades académicas');
    } finally {
      setLoading(false);
    }
  };

  const selectUnit = (unit: AcademicUnit) => {
    console.log('📖 Unidad seleccionada - ID:', unit._id);
    console.log('📖 Unidad seleccionada completa:', unit);
    localStorage.setItem('selectedUnit', JSON.stringify(unit));
    history.push('/students');
  };

  const getUnitTypeLabel = (type: string) => {
    if (institution?.code === 'SENA') {
      return type === 'ficha' ? 'Ficha' : 'Curso';
    }
    return type === 'materia' ? 'Materia' : 'Unidad';
  };

  const getUnitTypeColor = (type: string) => {
    if (institution?.code === 'SENA') {
      return type === 'ficha' ? 'secondary' : 'primary';
    }
    return type === 'materia' ? 'primary' : 'tertiary';
  };

  // Si no hay institución, mostrar mensaje
  if (!institution) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/institutions" />
            </IonButtons>
            <IonTitle>Unidades Académicas</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText color="danger">
            <p>No hay institución seleccionada</p>
          </IonText>
          <IonButton expand="block" onClick={() => history.push('/institutions')}>
            Seleccionar Institución
          </IonButton>
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
          <IonTitle>
            {institution.code === 'SENA' ? 'Fichas' : 'Materias'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        {/* Loading indicator */}
        <IonLoading isOpen={loading} message="Cargando unidades..." />

        {/* Información de la institución */}
        <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '8px' }}>
          <IonText color="dark">
            <p style={{ margin: 0 }}>
              <strong>Institución:</strong> {institution.name}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
              <strong>Código:</strong> {institution.code}
            </p>
          </IonText>
        </div>

        {/* Mensaje de error */}
        {error && (
          <IonText color="danger">
            <p style={{ marginBottom: '15px' }}>{error}</p>
          </IonText>
        )}

        {/* Lista de unidades */}
        {!loading && !error && (
          <>
            {units.length === 0 ? (
              <IonText color="warning">
                <p>No hay {institution.code === 'SENA' ? 'fichas' : 'materias'} disponibles para esta institución</p>
              </IonText>
            ) : (
              <IonList>
                {units.map((unit) => {
                  const idKey = unit._id || unit.id;
                  return (
                    <IonItem 
                      key={idKey} 
                      button 
                      onClick={() => selectUnit(unit)}
                      detail={true}
                    >
                      <IonLabel>
                        <h2 style={{ fontWeight: 'bold' }}>{unit.name}</h2>
                        <p>Código: {unit.code}</p>
                        <IonChip color={getUnitTypeColor(unit.type)} outline={true} style={{ marginTop: '8px' }}>
                          {getUnitTypeLabel(unit.type)}
                        </IonChip>
                      </IonLabel>
                    </IonItem>
                  );
                })}
              </IonList>
            )}

            {/* Botón para cambiar de institución */}
            <IonButton 
              expand="block" 
              fill="clear" 
              onClick={() => {
                localStorage.removeItem('selectedInstitution');
                localStorage.removeItem('selectedUnit');
                history.push('/institutions');
              }}
              style={{ marginTop: '20px' }}
            >
              Cambiar Institución
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default UnitSelection;