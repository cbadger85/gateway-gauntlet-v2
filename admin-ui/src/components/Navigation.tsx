import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useHasRole } from '../hooks/useHasRole';
import routesConfig from '../routesConfig';
import { logout } from '../store/auth/authSlice';
import NavLink from './NavLink';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: theme.palette.background.default,
  },
  navLinkRightMargin: {
    marginRight: theme.spacing(6),
  },
}));

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
            horizontal
          >
            {route.name?.toUpperCase()}
          </NavLink>
        ))}
        <Button onClick={handleLogout} className={classes.navLinkRightMargin}>
          Logout
        </Button>
      </Box>
      <Divider />
    </AppBar>
  );
};

export default Navigation;
