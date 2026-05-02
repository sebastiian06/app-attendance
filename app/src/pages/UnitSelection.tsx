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
  IonText,
  IonButton,
  IonCard,
  IonBadge
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
      
      // app/src/pages/UnitSelection.tsx (solo la parte del IonContent)
<IonContent className="ion-padding">
  <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
    
    {/* Título centrado */}
    <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '8px' }}>
        {institution?.code === 'SENA' ? 'Selecciona tu Ficha' : 'Selecciona tu Materia'}
      </h2>
      <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
        {institution?.name}
      </p>
    </div>

    {/* Información de la institución */}
    <div style={{ 
      backgroundColor: '#E8F5E9', 
      padding: '12px 16px', 
      borderRadius: '12px',
      marginBottom: '20px',
      textAlign: 'center'
    }}>
      <IonText color="dark">
        <p style={{ margin: 0 }}>
          <strong>Institución:</strong> {institution?.name}
        </p>
      </IonText>
    </div>

    {/* Resto del contenido (lista de unidades) */}
    <IonList style={{ padding: '0 16px' }}>
      {units.map((unit) => (
        <IonCard key={unit._id} style={{ margin: '12px 0', borderRadius: '16px' }}>
          <IonItem button onClick={() => selectUnit(unit)} detail={false}>
            <IonLabel>
              <h3 style={{ fontWeight: 'bold', fontSize: '16px' }}>{unit.name}</h3>
              <p>Código: {unit.code}</p>
              <IonBadge color={unit.type === 'ficha' ? 'secondary' : 'primary'}>
                {unit.type === 'ficha' ? 'Ficha' : 'Materia'}
              </IonBadge>
            </IonLabel>
          </IonItem>
        </IonCard>
      ))}
    </IonList>
  </div>
</IonContent>
    </IonPage>
  );
};

export default UnitSelection;