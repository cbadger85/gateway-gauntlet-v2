import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import colors from '../colors';
import { useHasRole } from '../hooks/useHasRole';
import { Role, User } from '../types/User';
import { enumToCapitalcase } from '../utils/enumToCapitalcase';

const useStyles = makeStyles(theme => ({
  lightText: {
    color: colors.blueGray[7],
  },
  topMargin: {
    marginTop: theme.spacing(2),
  },
}));

export const RoleDisplay: React.FC<{ role: Role; isLast?: boolean }> = ({
  role,
  isLast,
}) => {
  const classes = useStyles();

  return (
    <span className={classes.lightText}>
      <span>{enumToCapitalcase(role)}</span>
      {!isLast && <span>, </span>}
    </span>
  );
};

const UserCardViewMode: React.FC<UserCardViewDetailsProps> = ({
  user,
  setIsEditMode,
}) => {
  const classes = useStyles();
  const hasRole = useHasRole();

  const handleSetIsEditMode = (): void => {
    setIsEditMode(user.id);
  };

  const canEditUser = (): boolean => {
    if (hasRole(Role.SUPER_ADMIN)) {
      return true;
    }

    if (
      hasRole(Role.ADMIN) &&
      !user.roles.includes(Role.SUPER_ADMIN) &&
      !user.roles.includes(Role.ADMIN)
    ) {
      return true;
    }

    return false;
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="h2">
          {user.name}
        </Typography>
        {canEditUser() && (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSetIsEditMode}
          >
            Edit
          </Button>
        )}
      </Box>
      <div>
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
      <div className={classes.topMargin}>
        <Typography variant="subtitle1" component="h3">
          Roles
        </Typography>
        {user.roles.map((role, i) => (
          <RoleDisplay
            key={role}
            role={role}
            isLast={i === user.roles.length - 1}
          />
        ))}
      </div>
    </>
  );
};

export default UserCardViewMode;

interface UserCardViewDetailsProps {
  user: User;
  setIsEditMode: (id: string) => void;
}
