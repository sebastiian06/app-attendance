// app/src/pages/StudentList.tsx
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
  IonButton,
  IonIcon,
  IonChip,
  IonRefresher,
  IonRefresherContent,
  IonAlert,
  IonBadge,
  IonLabel
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  personOutline, 
  refreshOutline, 
  qrCodeOutline, 
  peopleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  idCardOutline,
  schoolOutline
} from 'ionicons/icons';
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
  
  const unitJson = localStorage.getItem('selectedUnit');
  const institutionJson = localStorage.getItem('selectedInstitution');
  const unit: AcademicUnit | null = unitJson ? JSON.parse(unitJson) : null;
  const institution: Institution | null = institutionJson ? JSON.parse(institutionJson) : null;

  useEffect(() => {
    if (!unit) {
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
      const data = await getStudentsByUnit(unitId);
      
      let studentsArray: Student[] = [];
      if (Array.isArray(data)) {
        studentsArray = data;
      } else if (data && Array.isArray((data as any).students)) {
        studentsArray = (data as any).students;
      } else if (data && Array.isArray((data as any).data)) {
        studentsArray = (data as any).data;
      }
      
      const filteredStudents = studentsArray.filter((student: Student) => {
        if (student.roles) {
          return student.roles.includes('student') || student.roles.length === 0;
        }
        return true;
      });
      
      setStudents(filteredStudents);
      
      if (filteredStudents.length === 0) {
        setAlertMessage('No hay estudiantes inscritos en esta unidad.');
        setShowAlert(true);
      }
    } catch (err: any) {
      setError(err.message || 'No se pudieron cargar los estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const goToCreateSession = () => {
    if (students.length === 0) {
      setAlertMessage('No hay estudiantes inscritos. No se puede crear una sesión.');
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
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <IonText color="danger">
              <p>No hay unidad seleccionada</p>
            </IonText>
            <IonButton expand="block" onClick={() => history.push('/units')}>
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
          <IonRefresherContent pullingIcon={refreshOutline} pullingText="Desliza para actualizar" />
        </IonRefresher>

        <IonLoading isOpen={loading} message="Cargando estudiantes..." />

        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          
          {/* Título y contador */}
          <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>
            <h2 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '8px' }}>
              Lista de Estudiantes
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <IonChip color="primary">
                <IonIcon icon={peopleOutline} />
                <IonLabel>{students.length} Estudiantes</IonLabel>
              </IonChip>
              <IonChip color="secondary">
                <IonIcon icon={schoolOutline} />
                <IonLabel>{unit.name}</IonLabel>
              </IonChip>
            </div>
          </div>

          {/* Información de la unidad */}
          <div style={{ 
            backgroundColor: '#E8F5E9', 
            padding: '12px 16px', 
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <strong>{unit.name}</strong>
              <span style={{ marginLeft: '10px', color: '#666', fontSize: '12px' }}>Código: {unit.code}</span>
            </div>
            {institution && (
              <IonBadge color="success">{institution.name}</IonBadge>
            )}
          </div>

          {error && (
            <div style={{ backgroundColor: '#ffebee', padding: '12px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
              <IonText color="danger"><p style={{ margin: 0 }}>{error}</p></IonText>
            </div>
          )}

          {/* Tabla de estudiantes */}
          {!loading && !error && (
            <>
              {students.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                  <IonIcon icon={personOutline} style={{ fontSize: '64px', opacity: 0.5 }} />
                  <IonText color="warning"><p>No hay estudiantes inscritos</p></IonText>
                </div>
              ) : (
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {/* Cabecera de la tabla */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '50px 1fr 1.5fr 0.8fr',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '12px 16px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    <div>#</div>
                    <div>Nombre</div>
                    <div>Documento</div>
                    <div>Matrícula</div>
                  </div>
                  
                  {/* Cuerpo de la tabla */}
                  <div>
                    {students.map((student, index) => (
                      <div 
                        key={student._id || index}
                        style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '50px 1fr 1.5fr 0.8fr',
                          padding: '12px 16px',
                          borderBottom: '1px solid #f0f0f0',
                          backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                          fontSize: '14px',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ fontWeight: 'bold', color: '#4CAF50' }}>{index + 1}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            backgroundColor: '#4CAF50',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}>
                            {getInitials(student.nombre)}
                          </div>
                          <span>{student.nombre}</span>
                        </div>
                        <div>
                          <IonIcon icon={idCardOutline} style={{ fontSize: '14px', marginRight: '8px', verticalAlign: 'middle', color: '#666' }} />
                          {student.documento}
                        </div>
                        <div>
                          {student.matricula ? (
                            <IonBadge color="medium" style={{ fontSize: '12px' }}>
                              {student.matricula}
                            </IonBadge>
                          ) : (
                            <span style={{ color: '#ccc' }}>—</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón flotante para crear sesión */}
              <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
                <IonButton 
                  onClick={goToCreateSession}
                  disabled={students.length === 0}
                  style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '28px',
                    boxShadow: '0 4px 12px rgba(76,175,80,0.4)'
                  }}
                >
                  <IonIcon icon={qrCodeOutline} style={{ fontSize: '28px' }} />
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