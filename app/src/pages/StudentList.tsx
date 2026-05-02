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
  IonBadge
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { personOutline, schoolOutline, refreshOutline, qrCodeOutline, peopleOutline } from 'ionicons/icons';
import { getStudentsByUnit } from '../services/api';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();
  
  // Obtener datos del localStorage
  const unitJson = localStorage.getItem('selectedUnit');
  const institutionJson = localStorage.getItem('selectedInstitution');
  
  const unit: AcademicUnit | null = unitJson ? JSON.parse(unitJson) : null;
  const institution: Institution | null = institutionJson ? JSON.parse(institutionJson) : null;

  useEffect(() => {
    // Verificar si hay unidad seleccionada
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
      console.log('📚 Cargando estudiantes para unidad:', { 
        unitId, 
        unitName: unit.name,
        unitCode: unit.code 
      });
      
      const data = await getStudentsByUnit(unitId);
      console.log('✅ Datos de estudiantes recibidos:', data);
      console.log('✅ Tipo de datos:', typeof data);
      console.log('✅ Es array:', Array.isArray(data));
      
      let studentsArray: Student[] = [];
      
      // Manejar diferentes formatos de respuesta del backend
      if (Array.isArray(data)) {
        // Si la respuesta es un array directamente
        studentsArray = data;
        console.log('📊 Caso 1: data es array, longitud:', data.length);
      } 
      else if (data && typeof data === 'object') {
        // Si la respuesta es un objeto, buscar el array en sus propiedades
        const dataObj = data as Record<string, any>;
        console.log('📊 Caso 2: data es objeto, propiedades:', Object.keys(dataObj));
        
        if (Array.isArray(dataObj.students)) {
          studentsArray = dataObj.students;
          console.log('📊 Caso 2a: data.students es array, longitud:', dataObj.students.length);
        } 
        else if (Array.isArray(dataObj.data)) {
          studentsArray = dataObj.data;
          console.log('📊 Caso 2b: data.data es array, longitud:', dataObj.data.length);
        }
        else if (Array.isArray(dataObj.estudiantes)) {
          studentsArray = dataObj.estudiantes;
          console.log('📊 Caso 2c: data.estudiantes es array, longitud:', dataObj.estudiantes.length);
        }
        else if (Array.isArray(dataObj.people)) {
          studentsArray = dataObj.people;
          console.log('📊 Caso 2d: data.people es array, longitud:', dataObj.people.length);
        }
        else {
          // Buscar cualquier propiedad que sea un array
          const keys = Object.keys(dataObj);
          for (const key of keys) {
            if (Array.isArray(dataObj[key]) && dataObj[key].length > 0) {
              // Verificar si el primer elemento parece un estudiante
              const firstItem = dataObj[key][0];
              if (firstItem && (firstItem.nombre || firstItem.documento || firstItem._id)) {
                studentsArray = dataObj[key];
                console.log(`📊 Caso 2e: data.${key} es array de estudiantes, longitud:`, dataObj[key].length);
                break;
              }
            }
          }
        }
        
        // Si aún no hay estudiantes y el objeto tiene _id y nombre, podría ser un solo estudiante
        if (studentsArray.length === 0 && dataObj._id && dataObj.nombre) {
          studentsArray = [dataObj as Student];
          console.log('📊 Caso 2f: Objeto único convertido a array');
        }
      }
      
      // Filtrar solo estudiantes (si tienen roles, asegurar que sean estudiantes)
      const filteredStudents = studentsArray.filter((student: any) => {
        if (student.roles) {
          return student.roles.includes('student') || student.roles.length === 0;
        }
        return true;
      });
      
      console.log('📊 Estudiantes después de filtrar:', filteredStudents.length);
      setStudents(filteredStudents);
      
      if (filteredStudents.length === 0) {
        setAlertMessage('No hay estudiantes inscritos en esta unidad. Por favor, ejecute el seed con estudiantes de ejemplo.');
        setShowAlert(true);
      }
      
    } catch (err: any) {
      console.error('❌ Error detallado cargando estudiantes:', err);
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

  const getInitials = (name: string) => {
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

  // Validar si no hay unidad seleccionada
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
          <IonText color="danger">
            <p>No hay unidad seleccionada</p>
          </IonText>
          <IonButton expand="block" onClick={() => history.push('/units')}>
            Seleccionar Unidad
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

        {/* Información de la unidad */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          background: 'var(--ion-color-primary-tint, #e0e0e0)', 
          borderRadius: '10px'
        }}>
          <IonText color="dark">
            <h3 style={{ margin: 0, fontSize: '18px' }}>{unit.name}</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
              Código: {unit.code} | {unit.type === 'ficha' ? 'Ficha' : 'Materia'}
            </p>
            {institution && (
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
                {institution.name}
              </p>
            )}
          </IonText>
        </div>

        {/* Contador de estudiantes */}
        {!loading && !error && (
          <IonChip color="primary" style={{ marginBottom: '15px' }}>
            <IonIcon icon={peopleOutline} />
            <IonLabel>{students.length} Estudiantes inscritos</IonLabel>
          </IonChip>
        )}

        {/* Mensaje de error */}
        {error && (
          <IonText color="danger">
            <p style={{ marginBottom: '15px', padding: '10px', background: '#ffebee', borderRadius: '8px' }}>
              {error}
            </p>
          </IonText>
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
              <IonList>
                {students.map((student, index) => (
                  <IonItem key={student._id || index}>
                    <IonAvatar slot="start">
                      <div style={{ 
                        backgroundColor: 'var(--ion-color-primary)', 
                        width: '100%', 
                        height: '100%', 
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
                      <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>{student.nombre}</h2>
                      <p style={{ fontSize: '14px' }}>Documento: {student.documento}</p>
                      {student.matricula && (
                        <IonBadge color="medium" style={{ marginTop: '5px' }}>
                          {student.matricula}
                        </IonBadge>
                      )}
                    </IonLabel>
                    <IonIcon icon={schoolOutline} slot="end" color="medium" />
                  </IonItem>
                ))}
              </IonList>
            )}

            {/* Botón para crear sesión QR */}
            <div style={{ marginTop: '20px', marginBottom: '30px' }}>
              <IonButton 
                expand="block" 
                onClick={goToCreateSession}
                disabled={students.length === 0}
              >
                <IonIcon slot="start" icon={qrCodeOutline} />
                Crear Sesión con QR
              </IonButton>
            </div>
          </>
        )}

        {/* Alertas */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Información"
          message={alertMessage}
          buttons={[{
            text: 'OK',
            handler: () => {
              if (alertMessage.includes('No hay estudiantes')) {
                console.log('Usuario entendió que no hay estudiantes');
              }
            }
          }]}
        />
      </IonContent>
    </IonPage>
  );
};

export default StudentList;