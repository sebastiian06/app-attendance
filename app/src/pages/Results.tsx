// app/src/pages/Results.tsx
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonLoading,
  IonText,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonChip,
  IonSegment,
  IonSegmentButton,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonAlert,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  checkmarkCircleOutline, 
  closeCircleOutline, 
  peopleOutline, 
  timeOutline,
  refreshOutline,
  printOutline,
  downloadOutline
} from 'ionicons/icons';
import { getSessionResults } from '../services/api';

interface Student {
  _id: string;
  documento: string;
  nombre: string;
  matricula?: string;
}

interface AttendanceRecord {
  _id: string;
  personId: string;
  documento: string;
  status: 'accepted' | 'rejected';
  registeredAt: string;
  rejectReason?: string;
}

interface SessionData {
  _id: string;
  unitId: string;
  institutionId: string;
  status: string;
  qrToken: string;
  expiresAt: string;
  createdAt: string;
}

interface ResultsData {
  session: SessionData;
  students: Student[];
  attendance: AttendanceRecord[];
  summary: {
    total: number;
    present: number;
    absent: number;
    attendanceRate: number;
  };
}

const Results: React.FC = () => {
  const [results, setResults] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [segment, setSegment] = useState<'present' | 'absent' | 'all'>('all');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  const sessionId = localStorage.getItem('currentSessionId');
  const unitJson = localStorage.getItem('selectedUnit');
  const unit = unitJson ? JSON.parse(unitJson) : null;

  useEffect(() => {
    if (!sessionId) {
      setAlertMessage('No hay una sesión activa para mostrar resultados');
      setShowAlert(true);
      return;
    }
    loadResults();
  }, []);

  const loadResults = async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('📡 Cargando resultados para sesión:', sessionId);
      
      const data = await getSessionResults(sessionId);
      console.log('✅ Resultados recibidos:', data);
      
      setResults(data);
      
    } catch (err: any) {
      console.error('❌ Error cargando resultados:', err);
      setError(err.message || 'No se pudieron cargar los resultados');
      setAlertMessage(err.message || 'Error al cargar los resultados');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = (event: CustomEvent) => {
    loadResults();
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
  };

  const getPresentStudents = () => {
    if (!results) return [];
    const presentIds = results.attendance
      .filter(a => a.status === 'accepted')
      .map(a => a.personId);
    return results.students.filter(s => presentIds.includes(s._id));
  };

  const getAbsentStudents = () => {
    if (!results) return [];
    const presentIds = results.attendance
      .filter(a => a.status === 'accepted')
      .map(a => a.personId);
    return results.students.filter(s => !presentIds.includes(s._id));
  };

  const getFilteredStudents = () => {
    if (!results) return [];
    
    switch (segment) {
      case 'present':
        return getPresentStudents();
      case 'absent':
        return getAbsentStudents();
      default:
        return results.students;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeLeft = (expiresAt: string) => {
    const now = new Date().getTime();
    const expires = new Date(expiresAt).getTime();
    const diff = Math.max(0, Math.floor((expires - now) / 1000));
    
    if (diff === 0) return 'Expirada';
    
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (!results) return;
    
    const csvData = [
      ['Documento', 'Nombre', 'Matrícula', 'Estado', 'Hora de Registro'],
      ...getFilteredStudents().map(student => {
        const attendance = results.attendance.find(a => a.personId === student._id);
        return [
          student.documento,
          student.nombre,
          student.matricula || '',
          attendance ? 'Presente' : 'Ausente',
          attendance ? formatDate(attendance.registeredAt) : ''
        ];
      })
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `asistencia_${results.session._id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'danger';
  };

  if (!sessionId) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/session" />
            </IonButtons>
            <IonTitle>Resultados</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText color="danger">
            <p>No hay una sesión activa</p>
          </IonText>
          <IonButton expand="block" onClick={() => history.push('/session')}>
            Crear Sesión
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
            <IonBackButton defaultHref="/session" />
          </IonButtons>
          <IonTitle>Resultados</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handlePrint}>
              <IonIcon slot="icon-only" icon={printOutline} />
            </IonButton>
            <IonButton onClick={handleExport}>
              <IonIcon slot="icon-only" icon={downloadOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent 
            pullingIcon={refreshOutline} 
            pullingText="Desliza para actualizar" 
          />
        </IonRefresher>

        <IonLoading isOpen={loading} message="Cargando resultados..." />

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        {results && (
          <>
            {/* Resumen de asistencia */}
            <IonCard>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol size="12" style={{ textAlign: 'center' }}>
                      <h3 style={{ marginTop: 0 }}>Resumen de Asistencia</h3>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="4" style={{ textAlign: 'center' }}>
                      <IonIcon 
                        icon={peopleOutline} 
                        style={{ fontSize: '32px', color: '#3880ff' }} 
                      />
                      <p style={{ margin: '5px 0 0 0' }}>
                        <strong>{results.summary.total}</strong>
                      </p>
                      <small>Total</small>
                    </IonCol>
                    <IonCol size="4" style={{ textAlign: 'center' }}>
                      <IonIcon 
                        icon={checkmarkCircleOutline} 
                        style={{ fontSize: '32px', color: '#4caf50' }} 
                      />
                      <p style={{ margin: '5px 0 0 0' }}>
                        <strong>{results.summary.present}</strong>
                      </p>
                      <small>Presentes</small>
                    </IonCol>
                    <IonCol size="4" style={{ textAlign: 'center' }}>
                      <IonIcon 
                        icon={closeCircleOutline} 
                        style={{ fontSize: '32px', color: '#f44336' }} 
                      />
                      <p style={{ margin: '5px 0 0 0' }}>
                        <strong>{results.summary.absent}</strong>
                      </p>
                      <small>Ausentes</small>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="12" style={{ textAlign: 'center', marginTop: '10px' }}>
                      <IonChip color={getAttendanceRateColor(results.summary.attendanceRate)}>
                        <IonIcon icon={timeOutline} />
                        <IonLabel>
                          {results.summary.attendanceRate}% Asistencia
                        </IonLabel>
                      </IonChip>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>

            {/* Información de la sesión */}
            <IonCard>
              <IonCardContent>
                <p><strong>Unidad:</strong> {unit?.name || results.session.unitId}</p>
                <p><strong>Estado:</strong> 
                  <IonChip color={results.session.status === 'active' ? 'success' : 'danger'}>
                    {results.session.status === 'active' ? 'Activa' : 'Cerrada'}
                  </IonChip>
                </p>
                <p><strong>Tiempo restante:</strong> {formatTimeLeft(results.session.expiresAt)}</p>
                <p><strong>Creada:</strong> {formatDate(results.session.createdAt)}</p>
              </IonCardContent>
            </IonCard>

            {/* Segmento para filtrar */}
            <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as any)}>
              <IonSegmentButton value="all">
                <IonLabel>Todos ({results.students.length})</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="present">
                <IonLabel>Presentes ({results.summary.present})</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="absent">
                <IonLabel>Ausentes ({results.summary.absent})</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {/* Lista de estudiantes filtrados */}
            <div style={{ marginTop: '15px' }}>
              {getFilteredStudents().length === 0 ? (
                <IonText color="warning">
                  <p style={{ textAlign: 'center' }}>No hay estudiantes en esta categoría</p>
                </IonText>
              ) : (
                <IonList>
                  {getFilteredStudents().map((student) => {
                    const attendance = results.attendance.find(a => a.personId === student._id);
                    const isPresent = !!attendance;
                    
                    return (
                      <IonItem key={student._id}>
                        <IonIcon 
                          slot="start" 
                          icon={isPresent ? checkmarkCircleOutline : closeCircleOutline} 
                          color={isPresent ? 'success' : 'danger'}
                          style={{ fontSize: '24px' }}
                        />
                        <IonLabel>
                          <h2>{student.nombre}</h2>
                          <p>Documento: {student.documento}</p>
                          {student.matricula && <p>Matrícula: {student.matricula}</p>}
                        </IonLabel>
                        {isPresent && attendance && (
                          <IonBadge color="success" slot="end">
                            {formatDate(attendance.registeredAt).split(',')[1]}
                          </IonBadge>
                        )}
                        {!isPresent && (
                          <IonBadge color="danger" slot="end">
                            Ausente
                          </IonBadge>
                        )}
                      </IonItem>
                    );
                  })}
                </IonList>
              )}
            </div>
          </>
        )}

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
            if (alertMessage.includes('No hay una sesión activa')) {
              history.push('/session');
            }
          }}
          header="Información"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Results;