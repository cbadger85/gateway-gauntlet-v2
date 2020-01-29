import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Homepage from './pages/Homepage';
import history from './utils/history';

const App: React.FC = () => {
  return (
    <div className="App">
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
    </div>
  );
};

export default App;
