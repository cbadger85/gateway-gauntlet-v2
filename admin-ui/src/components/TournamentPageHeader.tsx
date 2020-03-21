import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import { GameStatus } from '../types/Game';

const useStyles = makeStyles(theme => ({
  headerContainer: {
    marginBottom: theme.spacing(5),
  },
  statusPill: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
}));

const gameStatusMap: Record<GameStatus, string> = {
  [GameStatus.NEW]: 'new',
  [GameStatus.REGISTRATION_OPEN]: 'registration open',
  [GameStatus.REGISTRATION_CLOSED]: 'registration closed',
};

const TournamentPageHeader: React.FC = () => {
  const classes = useStyles();
  const [tournamentName, tournamentStatus] = useSelector((state: RootState) => [
    state.tournament.name,
    state.tournament.status,
  ]);

  return (
    <Box display="flex" alignItems="flex-start">
      <Typography
        variant="h4"
        component="h1"
        className={classes.headerContainer}
      >
        {tournamentName}
      </Typography>
      <Chip
        variant="outlined"
        color="secondary"
        label={gameStatusMap[tournamentStatus].toUpperCase()}
        size="small"
        className={classes.statusPill}
      />
    </Box>
  );
};

export default TournamentPageHeader;
