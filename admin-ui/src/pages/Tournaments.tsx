import React, { useState, useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useHasRole } from '../hooks/useHasRole';
import { Role } from '../types/User';
import AddTournamentDrawer from '../components/AddTournamentDrawer';
import { Game } from '../types/Game';
import { getGames } from '../controllers/gamesController';
import TournamentTable from '../components/TournamentTable';
import { useDispatch } from 'react-redux';
import { clearTournament } from '../store/tournament/tournamentSlice';

const useStyles = makeStyles(theme => ({
  pageContainer: {
    margin: theme.spacing(5, 0),
    padding: theme.spacing(0, 2),
  },
  headerContainer: {
    marginBottom: theme.spacing(5),
  },
}));

const TournamentManager: React.FC = () => {
  const classes = useStyles();
  const hasRole = useHasRole();
  const dispatch = useDispatch();
  const [isDrawerOpen, toggleDrawer] = useState(false);
  const [tournaments, setTournaments] = useState<Game[]>([]);

  useEffect(() => {
    getGames().then(games => {
      setTournaments(games);
    });
  }, []);

  useEffect(() => {
    dispatch(clearTournament());
  }, [dispatch]);

  const addTournament = (newTournament: Game): void => {
    setTournaments(tournaments => [...tournaments, newTournament]);
  };

  const handleToggleDrawer = (): void => {
    toggleDrawer(isOpen => !isOpen);
  };

  return (
    <>
      <AddTournamentDrawer
        isOpen={isDrawerOpen}
        closeDrawer={handleToggleDrawer}
        addTournament={addTournament}
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
              TOURNAMENTS
            </Typography>
            {hasRole(Role.ORGANIZER) && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleToggleDrawer}
              >
                Add Tournament
              </Button>
            )}
          </Box>
          {!!tournaments.length && (
            <TournamentTable tournaments={tournaments} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default TournamentManager;
