import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import AddUserDrawer from '../components/AddUserDrawer';
import UserCard from '../components/UserCard';
import { getAllUsers } from '../controllers/usersController';
import { useHasRole } from '../hooks/useHasRole';
import { Role, User } from '../types/User';

const useStyles = makeStyles(theme => ({
  pageContainer: {
    margin: theme.spacing(5, 0),
    padding: theme.spacing(0, 2),
  },
  headerContainer: {
    marginBottom: theme.spacing(5),
  },
}));

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editModeCardId, setEditModeCardId] = useState<string>();
  const [isDrawerOpen, toggleDrawer] = useState(false);
  const hasRole = useHasRole();
  const classes = useStyles();

  useEffect(() => {
    getAllUsers().then(users => setUsers(users));
  }, []);

  const handleToggleDrawer = (): void => {
    toggleDrawer(isOpen => !isOpen);
  };

  const setIsEditMode = (id: string): void => {
    setEditModeCardId(id);
  };

  const clearIsEditMode = (): void => {
    setEditModeCardId(undefined);
  };

  const handleOpenAddUserDrawer = (): void => {
    clearIsEditMode();
    handleToggleDrawer();
  };

  const handleUpdateUser = (updatedUser: User): void => {
    const updatedUsers = users.map(user =>
      user.id === updatedUser.id ? updatedUser : user,
    );

    setUsers(updatedUsers);
  };

  const handleAddUser = (user: User): void => {
    setUsers(users => [...users, user]);
  };

  return (
    <>
      <AddUserDrawer
        isOpen={isDrawerOpen}
        closeDrawer={handleToggleDrawer}
        onAddUser={handleAddUser}
      />
      <Box
        display="flex"
        justifyContent="center"
        className={classes.pageContainer}
      >
        <Box width="800px">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className={classes.headerContainer}
          >
            <Typography variant="h4" component="h1">
              USERS
            </Typography>
            {hasRole(Role.ADMIN) && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpenAddUserDrawer}
              >
                Add User
              </Button>
            )}
          </Box>
          {users.map(user => (
            <UserCard
              key={user.id}
              user={user}
              setIsEditMode={setIsEditMode}
              clearIsEditMode={clearIsEditMode}
              isEditMode={editModeCardId === user.id}
              updateUser={handleUpdateUser}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Users;
