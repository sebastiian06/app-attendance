// app/src/App.tsx (con BottomNav en todas las páginas protegidas)
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Importar las páginas */
import Login from './pages/Login';
import InstitutionSelection from './pages/InstitutionSelection';
import UnitSelection from './pages/UnitSelection';
import StudentList from './pages/StudentList';
import Session from './pages/Session';
import Results from './pages/Results';
import Attendance from './pages/Attendance';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';

const IonReactRouterWithChildren = IonReactRouter as any;

const App: React.FC = () => {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <IonApp>
      <IonReactRouterWithChildren>
        <IonRouterOutlet>
          {/* Ruta pública - no requiere autenticación */}
          <Route path="/attendance/:token" component={Attendance} />
          
          {/* Ruta de login */}
          <Route path="/login" component={Login} />
          
          {/* Rutas protegidas con BottomNav */}
          <Route path="/institutions">
            {isAuthenticated() ? (
              <>
                <InstitutionSelection />
                <BottomNav />
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          
          <Route path="/units">
            {isAuthenticated() ? (
              <>
                <UnitSelection />
                <BottomNav />
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          
          <Route path="/students">
            {isAuthenticated() ? (
              <>
                <StudentList />
                <BottomNav />
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          
          <Route path="/session">
            {isAuthenticated() ? (
              <>
                <Session />
                <BottomNav />
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          
          <Route path="/results">
            {isAuthenticated() ? (
              <>
                <Results />
                <BottomNav />
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          
          <Route path="/profile">
            {isAuthenticated() ? (
              <>
                <Profile />
                <BottomNav />
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          
          <Route exact path="/">
            {isAuthenticated() ? <Redirect to="/institutions" /> : <Redirect to="/login" />}
          </Route>
        </IonRouterOutlet>
      </IonReactRouterWithChildren>
    </IonApp>
  );
};

export default App;