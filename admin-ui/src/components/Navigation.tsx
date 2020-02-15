import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import colors from '../colors';
import { useHasRole } from '../hooks/useHasRole';
import routesConfig from '../routesConfig';
import { logout } from '../store/auth/authSlice';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: theme.palette.background.default,
  },
  activeNavLinkContainer: {
    position: 'relative',
    marginRight: theme.spacing(6),
  },
  activeNavLink: {
    backgroundColor: colors.pink[5],
    height: '5px',
    position: 'absolute',
    bottom: -8,
    width: '100%',
  },
}));

export const NavLink: React.FC<{ isActive?: boolean; to: string }> = ({
  to,
  isActive,
  children,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.activeNavLinkContainer}>
      <Button component={Link} to={to}>
        {children}
      </Button>
      {isActive && (
        <div className={classes.activeNavLink} data-testid="active-indicator" />
      )}
    </div>
  );
};

const Navigation: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const hasRole = useHasRole();

  const routes = Object.values(routesConfig()).filter(
    route =>
      route.menuType === 'navbar' &&
      (route.requiredRoles ? hasRole(...route.requiredRoles) : true),
  );

  const { pathname } = history.location;

  const handleLogout = (): void => {
    dispatch(logout());
  };

  return (
    <AppBar className={classes.appBar} position="static" elevation={0}>
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        p="0.5rem"
      >
        {routes.map(route => (
          <NavLink
            key={route.path}
            to={route.path}
            isActive={pathname.includes(route.path)}
          >
            {route.name?.toUpperCase()}
          </NavLink>
        ))}
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
      <Divider />
    </AppBar>
  );
};

export default Navigation;
