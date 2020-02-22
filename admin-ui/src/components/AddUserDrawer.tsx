import Drawer from '@material-ui/core/Drawer';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postUser } from '../controllers/usersController';
import { addSnackbar } from '../store/alert/alertSlice';
import { User } from '../types/User';
import UpsertUserForm, { FieldData } from './UpsertUserForm';

const useStyles = makeStyles(theme => ({
  bottomMargin: {
    marginBottom: theme.spacing(3),
  },
  addUserDrawer: {
    padding: theme.spacing(2, 3),
    height: 'inherit',
  },
}));

const AddUserDrawer: React.FC<AddUserDrawerProps> = ({
  isOpen,
  closeDrawer,
  onAddUser,
}) => {
  const [addUserError, setAddUserError] = useState<string>();
  const dispatch = useDispatch();
  const classes = useStyles();

  const clearErrorMessage = (): void => {
    setAddUserError(undefined);
  };

  const handleCloseDrawer = (): void => {
    clearErrorMessage();
    closeDrawer();
  };

  const handleAddUser = async (user: FieldData): Promise<void> => {
    postUser(user)
      .then(user => {
        onAddUser(user);
        clearErrorMessage();
        handleCloseDrawer();
        dispatch(addSnackbar(`${user.name} added`));
      })
      .catch((e: AxiosError) => {
        setAddUserError(e.response?.data?.message || 'Error creating user');
      });
  };

  return (
    <Drawer open={isOpen} anchor="right">
      <div className={classes.addUserDrawer}>
        <Typography
          variant="h5"
          component="h2"
          className={classes.bottomMargin}
        >
          Add User
        </Typography>
        <UpsertUserForm
          save={handleAddUser}
          closeForm={handleCloseDrawer}
          errorMessage={addUserError}
          clearErrorMessage={clearErrorMessage}
          isSideDrawer
        />
      </div>
    </Drawer>
  );
};

export default AddUserDrawer;

interface AddUserDrawerProps {
  isOpen?: boolean;
  closeDrawer: () => void;
  onAddUser: (user: User) => void;
}
