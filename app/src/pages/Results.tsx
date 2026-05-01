import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { getAttendanceBySession } from '../services/attendance';

const estudiantes = [
  { documento: 'EST-001', nombre: 'Juan' },
  { documento: 'EST-002', nombre: 'Maria' },
  { documento: 'EST-003', nombre: 'Carlos' }
];

const Results: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);

  const loadData = () => {
    const data = getAttendanceBySession();
    setRecords(data);
  };

  useEffect(() => {
    loadData();

    // 🔹 actualización automática cada 2s
    const interval = setInterval(loadData, 2000);

    return () => clearInterval(interval);
  }, []);

  const presentes = records.filter(r => r.status === 'ACCEPTED');
  const rechazados = records.filter(r => r.status === 'REJECTED');

  const presentesDocs = presentes.map(p => p.documento);

  const ausentes = estudiantes.filter(
    e => !presentesDocs.includes(e.documento)
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Resultados de Asistencia</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <h2>Presentes ({presentes.length})</h2>
        <ul>
          {presentes.map((p, i) => (
            <li key={i}>
              {p.nombre} ({p.documento})
            </li>
          ))}
        </ul>

        <h2>Ausentes ({ausentes.length})</h2>
        <ul>
          {ausentes.map((a) => (
            <li key={a.documento}>
              {a.nombre} ({a.documento})
            </li>
          ))}
        </ul>

        <h2>Rechazados ({rechazados.length})</h2>
        <ul>
          {rechazados.map((r, i) => (
            <li key={i}>
              {r.documento} - {r.reason}
            </li>
          ))}
        </ul>

      </IonContent>
    </IonPage>
  );
};

export default Results;