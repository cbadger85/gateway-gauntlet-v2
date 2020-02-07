import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import colors from '../colors';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import LoginForm from '../components/LoginForm';
import { postRequestResetPassword } from '../controllers/authController';
import { useLoaderDelay } from '../hooks/useLoaderDelay';
import { addSnackbar } from '../store/alert/alertSlice';
import { checkToken, login } from '../store/auth/authSlice';
import { RootState } from '../store/rootReducer';
import { Auth } from '../types/Auth';
import patch from '../images/grayscale-gauntlet.svg';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(25, 5),
  },
  logText: {
    color: colors.cyan[5],
  },
  inText: {
    color: theme.palette.primary.dark,
  },
  forgottenPasswordButtonContainer: {
    textAlign: 'right',
    width: '100%',
  },
  colorBar: {
    backgroundColor: colors.pink[5],
    height: '5px',
  },
  gradientBackground: {
    background: `linear-gradient(135deg, ${colors.blueGray[0]}, ${colors.blueGray[2]})`,
    textAlign: 'center',
  },
  image: {
    width: '50%',
    marginTop: theme.spacing(5),
  },
}));

const Login: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const showLoader = useLoaderDelay(auth === Auth.LOADING);
  const classes = useStyles();
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isForgotPasswordModalShown, setIsForgotPasswordModalShown] = useState(
    false,
  );

  useEffect(() => {
    if (auth === Auth.LOGGED_OUT) {
      dispatch(checkToken());
    }
  }, [auth, dispatch]);

  if (auth === Auth.LOGGED_IN) {
    return <Redirect to="/" />;
  }

  if (auth === Auth.LOADING && isCheckingToken) {
    return <>{showLoader && <div>Loading...</div>}</>;
  }

  const handleLogin = (values: {
    username: string;
    password: string;
  }): void => {
    setIsCheckingToken(false);
    dispatch(login(values.username, values.password));
  };

  const handleSubmitForgotPassword = (values: { email: string }): void => {
    postRequestResetPassword(values.email).then(() => {
      dispatch(addSnackbar('Email sent!', 'info'));
    });

    setIsForgotPasswordModalShown(false);
  };

  const openForgotPasswordModal = (): void => {
    setIsForgotPasswordModalShown(true);
  };

  const closeForgotPasswordModal = (): void => {
    setIsForgotPasswordModalShown(false);
  };

  return (
    <Grid container className={classes.root} component="main">
      <Grid
        item
        xs={false}
        sm={false}
        md={7}
        className={classes.gradientBackground}
      >
        <img
          src={patch}
          alt="gateway gauntlet patch"
          className={classes.image}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={5} component={Paper} elevation={5} square>
        <div className={classes.colorBar} />
        <div className={classes.loginContainer}>
          <div style={{ textAlign: 'left', width: '100%' }}>
            <Typography variant="h6" component="h1">
              <span className={classes.logText}>Login</span> to your account
            </Typography>
          </div>
          <LoginForm login={handleLogin} />
          <div className={classes.forgottenPasswordButtonContainer}>
            <Button onClick={openForgotPasswordModal}>Forgot Password?</Button>
          </div>
          <ForgotPasswordModal
            isOpen={isForgotPasswordModalShown}
            closeModal={closeForgotPasswordModal}
            submitForgotPassword={handleSubmitForgotPassword}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;
