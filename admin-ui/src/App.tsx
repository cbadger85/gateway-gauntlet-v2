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
import colors from './colors';

const theme = createMuiTheme({
  palette: {
    common: {
      black: colors.blueGray[0],
      white: colors.blueGray[9],
    },
    primary: {
      light: colors.lightBlue[6],
      main: colors.lightBlue[5],
      dark: colors.lightBlue[4],
    },
    secondary: {
      light: colors.cyan[6],
      main: colors.cyan[5],
      dark: colors.cyan[4],
    },
    background: {
      default: colors.blueGray[0],
      paper: colors.blueGray[1],
    },
    error: {
      light: colors.red[5],
      main: colors.red[4],
      dark: colors.red[3],
    },
    warning: {
      light: colors.yellow[4],
      main: colors.yellow[3],
      dark: colors.yellow[2],
    },
    info: {
      light: colors.lightBlue[5],
      main: colors.lightBlue[4],
      dark: colors.lightBlue[3],
    },
    success: {
      light: colors.teal[4],
      main: colors.teal[3],
      dark: colors.teal[2],
    },
    text: {
      primary: colors.blueGray[9],
      secondary: colors.blueGray[8],
      disabled: colors.blueGray[7],
      hint: colors.blueGray[7],
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    type: 'dark',
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
