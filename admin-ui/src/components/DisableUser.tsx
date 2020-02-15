import React from 'react';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import colors from '../colors';
import {
  postDisableUser,
  postEnableUser,
} from '../controllers/usersController';
import { User } from '../types/User';
import { useDispatch } from 'react-redux';
import { addSnackbar } from '../store/alert/alertSlice';

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(1),
  },
  redButton: {
    borderColor: colors.red[5],
    color: colors.red[5],
    '&:hover': {
      backgroundColor: `${colors.red[3]}22`,
      borderColor: colors.red[4],
    },
  },
  greenButton: {
    borderColor: colors.teal[5],
    color: colors.teal[5],
    '&:hover': {
      backgroundColor: `${colors.teal[3]}22`,
      borderColor: colors.teal[4],
    },
  },
}));

const DisableUser: React.FC<DisableUserProps> = ({
  onClick,
  user,
  updateUser,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleEnableUser = async (): Promise<void> => {
    postEnableUser(user.id)
      .then(() => {
        updateUser({ ...user, sessionId: 'enabled' });
        onClick();
        dispatch(addSnackbar(`${user.name} enabled`));
      })
      .catch(() => {
        dispatch(addSnackbar('Failed to enable user', 'error'));
      });
  };

  const handleDisableUser = async (): Promise<void> => {
    postDisableUser(user.id)
      .then(() => {
        updateUser({ ...user, sessionId: undefined });
        onClick();
        dispatch(addSnackbar(`${user.name} disabled`));
      })
      .catch(() => {
        dispatch(addSnackbar('Failed to disable user', 'error'));
      });
  };

  return user.sessionId ? (
    <Button
      className={`${classes.button} ${classes.redButton}`}
      onClick={handleDisableUser}
    >
      Disable User
    </Button>
  ) : (
    <Button
      className={`${classes.button} ${classes.greenButton}`}
      onClick={handleEnableUser}
    >
      Enable User
    </Button>
  );
};

export default DisableUser;

interface DisableUserProps {
  onClick: () => void;
  updateUser: (user: User) => void;
  user: User;
}
