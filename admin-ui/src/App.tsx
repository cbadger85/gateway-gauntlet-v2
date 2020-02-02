import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Homepage from './pages/Homepage';
import history from './utils/history';
import CssBaseline from '@material-ui/core/CssBaseline';
import SnackbarManager from './components/SnackbarAlert';

const App: React.FC = () => {
  return (
    <div className="App">
      <CssBaseline />
      <Router history={history}>
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <ProtectedRoute exact path="/">
            <Homepage />
          </ProtectedRoute>
          <Route>
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
      <SnackbarManager />
    </div>
  );
};

export default App;
