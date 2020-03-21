import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useParams } from 'react-router-dom';
import TournamentNavigation from '../components/TournamentNavigation';
import TournamentPageHeader from '../components/TournamentPageHeader';
import routesConfig from '../routesConfig';
import { RootState } from '../store/rootReducer';
import { getTournament } from '../store/tournament/tournamentSlice';

const useStyles = makeStyles(theme => ({
  pageContainer: {
    margin: theme.spacing(5, 0),
    padding: theme.spacing(0, 2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const useGetTournament = (tournamentId: string): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTournament(tournamentId));
  }, [dispatch, tournamentId]);
};

const TournamentPage: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const classes = useStyles();
  const isTournamentLoaded = useSelector(
    (state: RootState) => !!state.tournament.name,
  );

  useGetTournament(tournamentId);

  if (!isTournamentLoaded) {
    return null;
  }

  const routes = Object.values(routesConfig()).filter(
    route => route.menuType === 'leftPanel',
  );

  return (
    <Box className={classes.pageContainer}>
      <TournamentNavigation />
      <Box height="auto" width="800px">
        <TournamentPageHeader />
        <Box>
          <Switch>
            {routes.map(route => (
              <Route key={route.name} path={route.path} exact={route.exact}>
                <route.component />
              </Route>
            ))}
          </Switch>
        </Box>
      </Box>
    </Box>
  );
};

export default TournamentPage;
