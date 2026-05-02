// app/src/pages/StudentList.tsx
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
  IonButton,
  IonAvatar,
  IonIcon,
  IonChip,
  IonRefresher,
  IonRefresherContent,
  IonAlert,
  IonBadge,
  IonCard
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  personOutline, 
  schoolOutline, 
  refreshOutline, 
  qrCodeOutline, 
  peopleOutline
} from 'ionicons/icons';
import { getStudentsByUnit } from '../services/api';

// Interfaces
interface Student {
  _id: string;
  documento: string;
  nombre: string;
  matricula?: string;
  roles: string[];
}

interface AcademicUnit {
  _id: string;
  code: string;
  name: string;
  type: string;
}

interface Institution {
  _id: string;
  code: string;
  name: string;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const history = useHistory();
  
  const unitJson = localStorage.getItem('selectedUnit');
  const institutionJson = localStorage.getItem('selectedInstitution');
  const unit: AcademicUnit | null = unitJson ? JSON.parse(unitJson) : null;
  const institution: Institution | null = institutionJson ? JSON.parse(institutionJson) : null;

  useEffect(() => {
    if (!unit) {
      console.log('No hay unidad seleccionada, redirigiendo...');
      history.replace('/units');
      return;
    }
    loadStudents();
  }, []);

  const loadStudents = async () => {
    if (!unit) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const unitId = unit._id;
      console.log('📚 Cargando estudiantes para unidad:', { unitId, unitName: unit.name });
      
      const data = await getStudentsByUnit(unitId);
      console.log('✅ Datos de estudiantes recibidos:', data);
      
      let studentsArray: Student[] = [];
      
      if (Array.isArray(data)) {
        studentsArray = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray((data as any).students)) {
          studentsArray = (data as any).students;
        } else if (Array.isArray((data as any).data)) {
          studentsArray = (data as any).data;
        } else if (Array.isArray((data as any).estudiantes)) {
          studentsArray = (data as any).estudiantes;
        } else {
          const possibleArrays = Object.values(data).filter(v => Array.isArray(v));
          if (possibleArrays.length > 0) {
            studentsArray = possibleArrays[0] as Student[];
          }
        }
      }
      
      const filteredStudents = studentsArray.filter((student: Student) => {
        if (student.roles) {
          return student.roles.includes('student') || student.roles.length === 0;
        }
        return true;
      });
      
      console.log('📊 Estudiantes procesados:', filteredStudents.length);
      setStudents(filteredStudents);
      
      if (filteredStudents.length === 0) {
        setAlertMessage('No hay estudiantes inscritos en esta unidad. Por favor, ejecute el seed con estudiantes de ejemplo.');
        setShowAlert(true);
      }
      
    } catch (err: any) {
      console.error('❌ Error cargando estudiantes:', err);
      setError(err.message || 'No se pudieron cargar los estudiantes');
      setAlertMessage(err.message || 'Error al cargar los estudiantes');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const goToCreateSession = () => {
    if (students.length === 0) {
      setAlertMessage('No hay estudiantes inscritos. No se puede crear una sesión sin estudiantes.');
      setShowAlert(true);
      return;
    }
    history.push('/session');
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleRefresh = (event: CustomEvent) => {
    loadStudents();
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
  };

  if (!unit) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/units" />
            </IonButtons>
            <IonTitle>Estudiantes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
            <IonText color="danger">
              <p>No hay unidad seleccionada</p>
            </IonText>
            <IonButton expand="block" onClick={() => history.push('/units')} style={{ maxWidth: '300px', margin: '0 auto' }}>
              Seleccionar Unidad
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
            <IonBackButton defaultHref="/units" />
          </IonButtons>
          <IonTitle>Estudiantes</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent 
            pullingIcon={refreshOutline} 
            pullingText="Desliza para actualizar" 
            refreshingSpinner="circles"
          />
        </IonRefresher>

        <IonLoading isOpen={loading} message="Cargando estudiantes..." />

        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          
          {/* Título centrado */}
          <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>
            <h2 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '8px', margin: 0 }}>
              Estudiantes Inscritos
            </h2>
            <p style={{ color: '#666', fontSize: '14px', margin: '5px 0 0 0' }}>
              {unit?.name}
            </p>
          </div>

          {/* Información de la unidad */}
          <div style={{ 
            backgroundColor: '#E8F5E9', 
            padding: '12px 16px', 
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0 }}>
              <strong>{unit?.name}</strong> | Código: {unit?.code}
            </p>
            {institution && (
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
                {institution.name}
              </p>
            )}
          </div>

          {/* Contador de estudiantes */}
          {!loading && !error && (
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <IonChip color="primary">
                <IonIcon icon={peopleOutline} />
                <IonLabel>{students.length} Estudiantes inscritos</IonLabel>
              </IonChip>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div style={{ 
              backgroundColor: '#ffebee', 
              padding: '12px', 
              borderRadius: '8px',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              <IonText color="danger">
                <p style={{ margin: 0 }}>{error}</p>
              </IonText>
            </div>
          )}

          {/* Lista de estudiantes */}
          {!loading && !error && (
            <>
              {students.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                  <IonIcon icon={personOutline} style={{ fontSize: '64px', opacity: 0.5 }} />
                  <IonText color="warning">
                    <p style={{ marginTop: '10px' }}>No hay estudiantes inscritos en esta unidad</p>
                  </IonText>
                  <IonButton fill="clear" onClick={loadStudents}>
                    Reintentar
                  </IonButton>
                </div>
              ) : (
                <IonList style={{ background: 'transparent', padding: 0 }}>
                  {students.map((student, index) => (
                    <IonCard key={student._id || index} style={{ margin: '12px 0', borderRadius: '16px' }}>
                      <IonItem detail={false} lines="none">
                        <IonAvatar slot="start">
                          <div style={{ 
                            backgroundColor: '#4CAF50', 
                            width: '44px', 
                            height: '44px', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '18px'
                          }}>
                            {getInitials(student.nombre)}
                          </div>
                        </IonAvatar>
                        <IonLabel>
                          <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                            {student.nombre}
                          </h2>
                          <p style={{ fontSize: '14px', margin: '2px 0' }}>
                            Documento: {student.documento}
                          </p>
                          {student.matricula && (
                            <IonBadge color="medium" style={{ marginTop: '5px' }}>
                              {student.matricula}
                            </IonBadge>
                          )}
                        </IonLabel>
                        <IonIcon icon={schoolOutline} slot="end" color="medium" style={{ fontSize: '24px' }} />
                      </IonItem>
                    </IonCard>
                  ))}
                </IonList>
              )}

              {/* Botón para crear sesión QR centrado */}
              <div style={{ textAlign: 'center', marginTop: '24px', marginBottom: '30px' }}>
                <IonButton 
                  expand="block" 
                  onClick={goToCreateSession}
                  disabled={students.length === 0}
                  style={{ maxWidth: '300px', margin: '0 auto', height: '48px' }}
                >
                  <IonIcon slot="start" icon={qrCodeOutline} />
                  Crear Sesión con QR
                </IonButton>
              </div>
            </>
          )}
        </div>

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

export default StudentList;