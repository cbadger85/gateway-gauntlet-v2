import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';
import { User } from '../types/User';
import UserCardEditMode from './UserCardEditMode';
import UserCardViewMode from './UserCardViewMode';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: '500px',
    marginBottom: theme.spacing(2),
  },
}));

const UserCard: React.FC<UserCardProps> = ({
  user,
  isEditMode,
  setIsEditMode,
  clearIsEditMode,
  updateUser,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          {isEditMode ? (
            <UserCardEditMode
              user={user}
              updateUser={updateUser}
              clearIsEditMode={clearIsEditMode}
            />
          ) : (
            <UserCardViewMode user={user} setIsEditMode={setIsEditMode} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCard;

interface UserCardProps {
  user: User;
  isEditMode?: boolean;
  setIsEditMode: (id: string) => void;
  clearIsEditMode: () => void;
  updateUser: (user: User) => void;
}
