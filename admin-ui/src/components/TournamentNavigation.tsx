import React from 'react';
import Paper from '@material-ui/core/Paper';
import NavLink from '../components/NavLink';
import routesConfig from '../routesConfig';
import history from '../utils/history';
import { useParams } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  navigationContainer: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(6),
    minWidth: '300px',
    marginRight: theme.spacing(5),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    height: 'min-content',
  },
}));

const TournamentNavigation: React.FC = () => {
  const classes = useStyles();
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navLinks = Object.values(routesConfig({ tournamentId })).filter(
    route => route.menuType === 'leftPanel',
  );

  const { pathname } = history.location;

  return (
    <Paper className={classes.navigationContainer}>
      {navLinks.map(route => (
        <NavLink
          key={route.name}
          to={route.path}
          isActive={pathname === route.path}
        >
          {route.name}
        </NavLink>
      ))}
    </Paper>
  );
};

export default TournamentNavigation;
