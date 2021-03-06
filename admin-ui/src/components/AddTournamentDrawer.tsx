import Drawer from '@material-ui/core/Drawer';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postGame } from '../controllers/gamesController';
import { addSnackbar } from '../store/alert/alertSlice';
import { getOrganizerList } from '../store/organizer/organizerSlice';
import { RootState } from '../store/rootReducer';
import { Game } from '../types/Game';
import AddTournamentForm, { AddTournamentFieldData } from './AddTournamentForm';

const useStyles = makeStyles(theme => ({
  bottomMargin: {
    marginBottom: theme.spacing(3),
  },
  addUserDrawer: {
    padding: theme.spacing(2, 3),
    height: 'inherit',
    width: '400px',
  },
}));

const AddTournamentDrawer: React.FC<AddTournamentDrawerProps> = ({
  isOpen,
  closeDrawer,
  addTournament,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const organizers = useSelector((state: RootState) => state.organizers);
  const [addTournamentError, setAddTournamentError] = useState<string>();

  const clearAddTournamentError = (): void => {
    setAddTournamentError(undefined);
  };

  const handleCloseDrawer = (): void => {
    clearAddTournamentError();
    closeDrawer();
  };

  useEffect(() => {
    dispatch(getOrganizerList());
  }, [dispatch]);

  const createTournament = async (
    data: AddTournamentFieldData,
  ): Promise<void> => {
    postGame(data)
      .then(game => {
        handleCloseDrawer();
        addTournament(game);
        dispatch(addSnackbar(`${game.name} created`));
      })
      .catch((e: AxiosError) => {
        setAddTournamentError(
          e.response?.data?.message || 'Error adding tournament',
        );
      });
  };

  return (
    <Drawer open={isOpen} anchor="right">
      <div className={classes.addUserDrawer}>
        <Typography
          variant="h5"
          component="h2"
          className={classes.bottomMargin}
        >
          Add Tournament
        </Typography>
        <AddTournamentForm
          closeForm={handleCloseDrawer}
          organizers={organizers}
          errorMessage={addTournamentError}
          clearErrorMessage={clearAddTournamentError}
          save={createTournament}
        />
      </div>
    </Drawer>
  );
};

export default AddTournamentDrawer;

interface AddTournamentDrawerProps {
  isOpen?: boolean;
  closeDrawer: () => void;
  addTournament: (tournament: Game) => void;
}
