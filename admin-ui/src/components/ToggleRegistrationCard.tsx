import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import colors from '../colors';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/rootReducer';
import { GameStatus } from '../types/Game';
import {
  openRegistration,
  closeRegistration,
} from '../store/tournament/tournamentSlice';

const useStyles = makeStyles(theme => ({
  registrationCardContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginTop: theme.spacing(1),
  },
  redButton: {
    borderColor: colors.red[5],
    color: colors.red[5],
    '&:hover': {
      backgroundColor: `${colors.red[3]}22`,
      borderColor: colors.red[4],
    },
  },
  greenButton: {
    borderColor: colors.teal[5],
    color: colors.teal[5],
    '&:hover': {
      backgroundColor: `${colors.teal[3]}22`,
      borderColor: colors.teal[4],
    },
  },
}));

const ToggleRegistrationCard: React.FC = () => {
  const classes = useStyles();
  const status = useSelector((state: RootState) => state.tournament.status);
  const dispatch = useDispatch();

  const handleOpenRegistration = (): void => {
    dispatch(openRegistration());
  };

  const handleCloseRegistration = (): void => {
    dispatch(closeRegistration());
  };

  return (
    <Card>
      <CardContent className={classes.registrationCardContent}>
        {status === GameStatus.REGISTRATION_CLOSED ||
        status === GameStatus.NEW ? (
          <Button
            className={classes.greenButton}
            size="large"
            onClick={handleOpenRegistration}
            data-testid="open-registration-button"
          >
            Open Registration
          </Button>
        ) : (
          <Button
            className={classes.redButton}
            size="large"
            onClick={handleCloseRegistration}
            data-testid="close-registration-button"
          >
            Close Registration
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ToggleRegistrationCard;
