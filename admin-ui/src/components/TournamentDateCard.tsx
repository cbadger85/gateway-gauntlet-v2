import React from 'react';
import TournamentInfoToggleCard from '../components/TournamentInfoToggleCard';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { addDays, format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import TournamentDateCardEditMode from './TournamentDateCardEditMode';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  date: {
    fontSize: theme.typography.pxToRem(32),
  },
}));

export const DateDisplay: React.FC<{ date: Date; length?: number }> = ({
  date,
  length = 1,
}) => (
  <>
    {length === 1 ? (
      <div>{format(date, 'MMM do, yyyy')}</div>
    ) : (
      <Box display="flex" flexDirection="column">
        <div>{format(date, 'MMM do')} - </div>
        {date.getMonth() === addDays(date, length - 1).getMonth() ? (
          <div>{format(addDays(date, length - 1), 'do, yyyy')}</div>
        ) : (
          <div>{format(addDays(date, length - 1), 'MMM do, yyyy')}</div>
        )}
      </Box>
    )}
  </>
);

const TournamentDateCard: React.FC = () => {
  const { date, length } = useSelector((state: RootState) => ({
    date: state.tournament.date,
    length: state.tournament.length,
  }));

  const classes = useStyles();

  return (
    <TournamentInfoToggleCard title="Date" centered>
      {(isEditMode, toggleEditMode) =>
        isEditMode ? (
          <TournamentDateCardEditMode
            toggleEditMode={toggleEditMode}
            date={date}
            length={length}
          />
        ) : (
          <Typography component="span" className={classes.date}>
            <DateDisplay date={new Date(date)} length={length} />
          </Typography>
        )
      }
    </TournamentInfoToggleCard>
  );
};

export default TournamentDateCard;
