import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Person from '@material-ui/icons/Person';
import { Formik } from 'formik';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import LoginForm from '../components/LoginForm';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import { useLoaderDelay } from '../hooks/useLoaderDelay';
import { checkToken, login } from '../store/auth/authSlice';
import { RootState } from '../store/rootReducer';
import { Auth } from '../types/Auth';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(8, 5),
  },
  loginIcon: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  forgottenPasswordButtonContainer: {
    textAlign: 'right',
    width: '100%',
  },
}));

const Login: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const history = useHistory();
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

  useEffect(() => {
    if (auth === Auth.LOGGED_IN) {
      history.push('/');
    }
  }, [auth, history]);

  const loginInitialValues = useMemo(
    () => ({
      username: '',
      password: '',
    }),
    [],
  );

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
      <Grid item xs={false} sm={false} md={7} />
      <Grid item xs={12} sm={12} md={5} component={Paper} elevation={5} square>
        <div className={classes.loginContainer}>
          <Avatar className={classes.loginIcon}>
            <Person fontSize="large" />
          </Avatar>
          <Formik
            initialValues={loginInitialValues}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
            validateOnMount
          >
            {props => <LoginForm {...props} />}
          </Formik>
          <div className={classes.forgottenPasswordButtonContainer}>
            <Button color="secondary" onClick={openForgotPasswordModal}>
              Forgot Password?
            </Button>
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
