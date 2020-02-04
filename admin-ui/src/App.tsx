import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Homepage from './pages/Homepage';
import ResetPassword from './pages/PasswordReset';
import history from './utils/history';
import CssBaseline from '@material-ui/core/CssBaseline';
import SnackbarManager from './components/SnackbarAlert';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { cyan, lime } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: cyan,
    secondary: lime,
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
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
            <Route exact path="/users/:userId/password/:passwordResetId/reset">
              <ResetPassword />
            </Route>
            <Route>
              <Redirect to="/login" />
            </Route>
          </Switch>
        </Router>
        <SnackbarManager />
      </div>
    </ThemeProvider>
  );
};

export default App;
