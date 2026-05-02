// app/src/pages/Login.tsx
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonLoading
} from '@ionic/react';
import { useState } from 'react';
import { login } from '../services/api';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [documento, setDocumento] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async () => {
    // Validar campos vacíos
    if (!documento.trim()) {
      setError('Por favor ingrese su documento');
      return;
    }
    
    if (!password.trim()) {
      setError('Por favor ingrese su contraseña');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Llamar a la función login del servicio
      const response = await login(documento, password);
      
      console.log('Login exitoso:', response);
      
      // 🔹 Redirigir a selección de institución (no directamente a units)
      history.push('/institutions');
      
    } catch (err: any) {
      console.error('Error en login:', err);
      
      // Manejar diferentes tipos de errores
      if (err.message === 'Failed to fetch') {
        setError('No se puede conectar al servidor. Verifique que el backend esté corriendo en http://localhost:4000');
      } else if (err.message.includes('401')) {
        setError('Documento o contraseña incorrectos');
      } else {
        setError(err.message || 'Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  // Credenciales de prueba para facilitar pruebas
  const fillDemoCredentials = () => {
    setDocumento('DOCENTE-001');
    setPassword('demo123');
    setError('');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>App Attendance</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
          <h2>Inicio de Sesión</h2>
          <p>Docente / Instructor</p>
        </div>

        <IonItem>
          <IonLabel position="stacked">Documento</IonLabel>
          <IonInput
            type="text"
            value={documento}
            onIonChange={(e) => setDocumento(e.detail.value || '')}
            placeholder="Ej: DOCENTE-001"
            autocomplete="off"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Contraseña</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value || '')}
            placeholder="********"
          />
        </IonItem>

        {error && (
          <IonText color="danger">
            <p style={{ marginLeft: '16px' }}>{error}</p>
          </IonText>
        )}

        <IonButton 
          expand="block" 
          onClick={handleLogin}
          disabled={loading}
          style={{ marginTop: '20px' }}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </IonButton>

        <IonButton 
          expand="block" 
          fill="clear" 
          onClick={fillDemoCredentials}
          style={{ marginTop: '10px' }}
        >
          Usar credenciales de prueba
        </IonButton>

        <IonLoading
          isOpen={loading}
          message="Iniciando sesión..."
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;