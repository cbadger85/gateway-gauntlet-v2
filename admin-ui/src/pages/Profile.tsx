import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/rootReducer';
import colors from '../colors';
import Button from '@material-ui/core/Button';
import PasswordResetForm from '../components/PasswordResetForm';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { putChangePassword } from '../controllers/usersController';
import { addSnackbar } from '../store/alert/alertSlice';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  pageContainer: {
    margin: theme.spacing(5, 0),
    padding: theme.spacing(0, 2),
    minHeight: `calc(100vh - ${theme.spacing(27)}px)`,
    display: 'flex',
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: theme.spacing(5),
  },
  profilePaper: {
    height: '100%',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(5),
  },
  profilePaperWidth: {
    width: '800px',
  },
  profilePaperMinWidth: {
    width: '400px',
  },
  lightText: {
    color: colors.blueGray[7],
  },
  topMargin: {
    marginTop: theme.spacing(2),
  },
  extraTopMargin: {
    marginTop: theme.spacing(5),
  },
}));

const Profile: React.FC = () => {
  const classes = useStyles();
  const matches = useMediaQuery('(min-width: 800px)');
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isChangingPassword, toggleIsChangingPassword] = useState(false);

  const handleToggleIsChangingPassword = (): void => {
    toggleIsChangingPassword(isChanging => !isChanging);
  };

  const handleChangePassword = async ({
    password,
  }: {
    password: string;
  }): Promise<void> => {
    putChangePassword(user.id, password)
      .then(() => {
        handleToggleIsChangingPassword();
        dispatch(addSnackbar('Password changed'));
      })
      .catch(() => {
        dispatch(addSnackbar('Failed to change password', 'error'));
      });
  };

  return (
    <div className={classes.pageContainer}>
      <Box height="auto">
        <Typography
          variant="h4"
          component="h1"
          className={classes.headerContainer}
        >
          Profile
        </Typography>
        <Paper
          className={`${classes.profilePaper} ${
            matches ? classes.profilePaperWidth : classes.profilePaperMinWidth
          }`}
        >
          <div>
            <Typography variant="h5" component="h2">
              {user.name}
            </Typography>
          </div>
          <div className={classes.topMargin}>
            <Typography
              variant="subtitle1"
              component="span"
              className={classes.lightText}
            >
              {user.username}
            </Typography>
          </div>
          <div>
            <Typography
              variant="subtitle2"
              component="span"
              className={classes.lightText}
            >
              {user.email}
            </Typography>
          </div>
          <Divider className={classes.extraTopMargin} />
          <div className={classes.extraTopMargin}>
            {isChangingPassword ? (
              <Box display="flex" justifyContent="flex-start">
                <Box minWidth={matches ? '400px' : '368px'}>
                  <Typography variant="h5" component="h3">
                    Change Password
                  </Typography>
                  <PasswordResetForm
                    submitPasswordReset={handleChangePassword}
                    profilePage
                    onCancel={handleToggleIsChangingPassword}
                  />
                </Box>
              </Box>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleToggleIsChangingPassword}
              >
                Change Password
              </Button>
            )}
          </div>
        </Paper>
      </Box>
    </div>
  );
};

export default Profile;
