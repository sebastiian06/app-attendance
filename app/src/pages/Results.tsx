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
  IonIcon,
  IonChip,
  IonSegment,
  IonSegmentButton,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonAlert,
  IonFab,
  IonFabButton
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
  downloadOutline,
  calendarOutline,
  schoolOutline,
  idCardOutline,
  qrCodeOutline
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

interface ResultsData {
  session: {
    _id: string;
    unitId: string;
    institutionId: string;
    status: string;
    qrToken: string;
    roomCode?: string;
    expiresAt: string;
    createdAt: string;
  };
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
      const data = await getSessionResults(sessionId);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'No se pudieron cargar los resultados');
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
      case 'present': return getPresentStudents();
      case 'absent': return getAbsentStudents();
      default: return results.students;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'danger';
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
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <IonText color="danger"><p>No hay una sesión activa</p></IonText>
            <IonButton expand="block" onClick={() => history.push('/session')}>Crear Sesión</IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/session" /></IonButtons>
          <IonTitle>Resultados</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handlePrint}><IonIcon slot="icon-only" icon={printOutline} /></IonButton>
            <IonButton onClick={handleExport}><IonIcon slot="icon-only" icon={downloadOutline} /></IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent pullingIcon={refreshOutline} pullingText="Desliza para actualizar" />
        </IonRefresher>

        <IonLoading isOpen={loading} message="Cargando resultados..." />

        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          
          {error && (
            <div style={{ backgroundColor: '#ffebee', padding: '12px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
              <IonText color="danger"><p style={{ margin: 0 }}>{error}</p></IonText>
            </div>
          )}

          {results && (
            <>
              {/* Tarjetas de resumen */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
                gap: '12px', 
                marginBottom: '20px' 
              }}>
                <div style={{ backgroundColor: '#E3F2FD', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                  <IonIcon icon={peopleOutline} style={{ fontSize: '28px', color: '#2196F3' }} />
                  <h3 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>{results.summary.total}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>Total</p>
                </div>
                <div style={{ backgroundColor: '#E8F5E9', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                  <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '28px', color: '#4CAF50' }} />
                  <h3 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{results.summary.present}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>Presentes</p>
                </div>
                <div style={{ backgroundColor: '#FFEBEE', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                  <IonIcon icon={closeCircleOutline} style={{ fontSize: '28px', color: '#F44336' }} />
                  <h3 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#F44336' }}>{results.summary.absent}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>Ausentes</p>
                </div>
                <div style={{ backgroundColor: '#FFF3E0', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                  <IonIcon icon={timeOutline} style={{ fontSize: '28px', color: '#FF9800' }} />
                  <h3 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>{results.summary.attendanceRate}%</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>Asistencia</p>
                </div>
              </div>

              {/* Información de la sesión */}
              <div style={{ 
                backgroundColor: '#f5f5f5', 
                borderRadius: '12px', 
                padding: '12px 16px', 
                marginBottom: '20px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '10px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <IonIcon icon={schoolOutline} color="primary" />
                  <span><strong>{unit?.name || results.session.unitId}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IonIcon icon={calendarOutline} color="medium" />
                  <small>{new Date(results.session.createdAt).toLocaleDateString('es-CO')}</small>
                  <IonChip color={results.session.status === 'active' ? 'success' : 'danger'}>
                    {results.session.status === 'active' ? 'Activa' : 'Cerrada'}
                  </IonChip>
                </div>
              </div>

              {/* Segmento mejorado */}
              <div style={{ 
                backgroundColor: '#f0f2f5', 
                borderRadius: '14px', 
                padding: '6px',
                marginBottom: '20px'
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '6px'
                }}>
                  <button
                    onClick={() => setSegment('all')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: segment === 'all' ? '#4CAF50' : 'transparent',
                      color: segment === 'all' ? 'white' : '#333'
                    }}
                  >
                    Todos ({results.students.length})
                  </button>
                  <button
                    onClick={() => setSegment('present')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: segment === 'present' ? '#4CAF50' : 'transparent',
                      color: segment === 'present' ? 'white' : '#333'
                    }}
                  >
                    Presentes ({results.summary.present})
                  </button>
                  <button
                    onClick={() => setSegment('absent')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: segment === 'absent' ? '#F44336' : 'transparent',
                      color: segment === 'absent' ? 'white' : '#333'
                    }}
                  >
                    Ausentes ({results.summary.absent})
                  </button>
                </div>
              </div>

              {/* Tabla de resultados */}
              {getFilteredStudents().length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                  <IonText color="warning"><p>No hay estudiantes en esta categoría</p></IonText>
                </div>
              ) : (
                <div style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  overflow: 'auto',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {/* Cabecera de la tabla */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '50px 2fr 1.5fr 1.2fr 1fr',
                    backgroundColor: segment === 'present' ? '#4CAF50' : (segment === 'absent' ? '#F44336' : '#2196F3'),
                    color: 'white',
                    padding: '12px 16px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    minWidth: '500px'
                  }}>
                    <div>#</div>
                    <div>Nombre</div>
                    <div>Documento</div>
                    <div>Matrícula</div>
                    <div>Estado</div>
                  </div>
                  
                  {/* Cuerpo de la tabla */}
                  <div style={{ minWidth: '500px' }}>
                    {getFilteredStudents().map((student, index) => {
                      const attendance = results.attendance.find(a => a.personId === student._id);
                      return (
                        <div 
                          key={student._id}
                          style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '50px 2fr 1.5fr 1.2fr 1fr',
                            padding: '12px 16px',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                            fontSize: '13px',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{ fontWeight: 'bold', color: '#4CAF50' }}>{index + 1}</div>
                          <div>{student.nombre}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <IonIcon icon={idCardOutline} style={{ fontSize: '12px', color: '#666' }} />
                            {student.documento}
                          </div>
                          <div>
                            {student.matricula ? (
                              <IonBadge color="medium" style={{ fontSize: '11px' }}>{student.matricula}</IonBadge>
                            ) : (
                              <span style={{ color: '#ccc' }}>—</span>
                            )}
                          </div>
                          <div>
                            {attendance ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <IonBadge color="success" style={{ fontSize: '11px' }}>Presente</IonBadge>
                                <small style={{ fontSize: '10px', color: '#666' }}>
                                  {formatDate(attendance.registeredAt).split(',')[1]}
                                </small>
                              </div>
                            ) : (
                              <IonBadge color="danger" style={{ fontSize: '11px' }}>Ausente</IonBadge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Botón flotante */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => history.push('/session')}>
            <IonIcon icon={qrCodeOutline} />
          </IonFabButton>
        </IonFab>

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