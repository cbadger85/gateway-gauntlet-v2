import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { putUser } from '../controllers/usersController';
import { User } from '../types/User';
import UpsertUserForm, { FieldData } from './UpsertUserForm';
import { useDispatch } from 'react-redux';
import { addSnackbar } from '../store/alert/alertSlice';

const useStyles = makeStyles(theme => ({
  bottomMargin: {
    marginBottom: theme.spacing(2),
  },
}));

const UserCardEditMode: React.FC<UserCardEditModeProps> = ({
  user,
  updateUser,
  clearIsEditMode,
}) => {
  const [updateUserError, setUpdateUserError] = useState<string>();
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleClearErrorMessage = (): void => {
    setUpdateUserError(undefined);
  };

  const handleClearIsEditMode = (): void => {
    setUpdateUserError(undefined);
    clearIsEditMode();
  };

  const handleUpdateUser = async (values: FieldData): Promise<void> => {
    putUser(user.id, values)
      .then(updatedUser => {
        updateUser(updatedUser);
        handleClearErrorMessage();
        clearIsEditMode();
        dispatch(addSnackbar(`${user.name} updated`));
      })
      .catch((e: AxiosError) => {
        setUpdateUserError(e.response?.data?.message || 'Error creating user');
      });
  };
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h5"
          component="h2"
          className={classes.bottomMargin}
        >
          Edit User
        </Typography>
        <IconButton onClick={handleClearIsEditMode}>
          <CancelIcon />
        </IconButton>
      </Box>
      <UpsertUserForm
        user={user}
        closeForm={clearIsEditMode}
        save={handleUpdateUser}
        clearErrorMessage={handleClearErrorMessage}
        errorMessage={updateUserError}
        updateUser={updateUser}
      />
    </>
  );
};

export default UserCardEditMode;

interface UserCardEditModeProps {
  user: User;
  updateUser: (user: User) => void;
  clearIsEditMode: () => void;
}
