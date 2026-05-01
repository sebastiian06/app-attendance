import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const unidades = [
  { id: '1', nombre: 'Programación Móvil' },
  { id: '2', nombre: 'Base de Datos' }
];

const UnitSelection: React.FC = () => {
  const history = useHistory();

  const handleSelect = (unidad: any) => {
    localStorage.setItem('unit', JSON.stringify(unidad));
    history.push('/session');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Seleccionar Unidad</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {unidades.map((u) => (
            <IonItem key={u.id}>
              <IonLabel>{u.nombre}</IonLabel>
              <IonButton onClick={() => handleSelect(u)}>
                Seleccionar
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UnitSelection;