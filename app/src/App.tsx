// app/src/App.tsx
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

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

const App: React.FC = () => {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <IonApp>
      <BrowserRouter>
        <IonRouterOutlet>
          <Route path="/attendance/:token" component={Attendance} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/institutions" exact>
            {isAuthenticated() ? <InstitutionSelection /> : <Redirect to="/login" />}
          </Route>
          <Route path="/units" exact>
            {isAuthenticated() ? <UnitSelection /> : <Redirect to="/login" />}
          </Route>
          <Route path="/students" exact>
            {isAuthenticated() ? <StudentList /> : <Redirect to="/login" />}
          </Route>
          <Route path="/session" exact>
            {isAuthenticated() ? <Session /> : <Redirect to="/login" />}
          </Route>
          <Route path="/results" exact>
            {isAuthenticated() ? <Results /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/">
            {isAuthenticated() ? <Redirect to="/institutions" /> : <Redirect to="/login" />}
          </Route>
        </IonRouterOutlet>
      </BrowserRouter>
    </IonApp>
  );
};

export default App;