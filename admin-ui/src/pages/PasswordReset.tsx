import React from 'react';
import PasswordResetForm from '../components/PasswordResetForm';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Avatar from '@material-ui/core/Avatar';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { postResetPassword } from '../controllers/usersController';
import { addSnackbar } from '../store/alert/alertSlice';
import { useQuery } from '../hooks/useQuery';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    margin: theme.spacing(3, 0, 1),
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  loginIcon: {
    margin: theme.spacing(-6, 0, 0, 0),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.secondary.main,
    boxShadow: theme.shadows[3],
  },
  form: {
    padding: theme.spacing(3),
  },
}));

const PasswordReset: React.FC = () => {
  const classes = useStyles();
  const { userId, passwordResetId } = useParams<{
    userId: string;
    passwordResetId: string;
  }>();
  const history = useHistory();
  const dispatch = useDispatch();
  const query = useQuery();

  const isNewUser = query.get('new') === 'true';

  const handleSubmitPasswordReset = (values: {
    password: string;
    confirmPassword: string;
  }): void => {
    postResetPassword(userId, passwordResetId, values.password)
      .then(() => {
        dispatch(addSnackbar('Password changed!'));
        history.push('/login');
      })
      .catch(() => {
        dispatch(
          addSnackbar(
            `Failed to ${isNewUser ? 'set' : 'update'} password`,
            'error',
          ),
        );
      });
  };

  return (
    <Container component="main" className={classes.root}>
      <Box width="300">
        <Paper elevation={3} className={classes.form}>
          <Box className={classes.iconContainer}>
            <Avatar className={classes.loginIcon}>
              <LockOpenIcon fontSize="large" />
            </Avatar>
          </Box>
          <Typography variant="h5" component="h1" className={classes.header}>
            {isNewUser ? 'Set Password' : 'Reset Password'}
          </Typography>
          <Typography paragraph>
            Please enter your new password below.
          </Typography>
          <PasswordResetForm submitPasswordReset={handleSubmitPasswordReset} />
        </Paper>
      </Box>
    </Container>
  );
};

export default PasswordReset;
