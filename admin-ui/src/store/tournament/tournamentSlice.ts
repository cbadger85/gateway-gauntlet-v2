import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game, GameStatus } from '../../types/Game';
import {
  getGameById,
  putOrganizer,
  deleteOrganizer,
} from '../../controllers/gamesController';
import { AppThunk } from '..';
import { addSnackbar } from '../alert/alertSlice';

const initialState: Game = {
  id: '',
  name: '',
  date: '',
  length: 1,
  organizers: [],
  missions: [],
  players: [],
  status: GameStatus.NEW,
  price: 0,
};

const tournamentSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    loadTournament(_, action: PayloadAction<Game>) {
      return action.payload;
    },
    clearTournament() {
      return initialState;
    },
  },
});

export default tournamentSlice.reducer;

export const { loadTournament, clearTournament } = tournamentSlice.actions;

export const getTournament = (id: string): AppThunk => dispatch => {
  getGameById(id).then(game => {
    dispatch(loadTournament(game));
  });
};

export const addOrganizer = (
  gameId: string,
  organizerId: string,
): AppThunk => dispatch => {
  putOrganizer(gameId, organizerId)
    .then(game => {
      dispatch(loadTournament(game));
      dispatch(addSnackbar('Organizer added'));
    })
    .catch(() => dispatch(addSnackbar('Failed to add organizer', 'error')));
};

export const removeOrganizer = (
  gameId: string,
  organizerId: string,
): AppThunk => dispatch => {
  deleteOrganizer(gameId, organizerId)
    .then(game => {
      dispatch(loadTournament(game));
      dispatch(addSnackbar('Organizer removed'));
    })
    .catch(() => dispatch(addSnackbar('Failed to remove organizer', 'error')));
};
