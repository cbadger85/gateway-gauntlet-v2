import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '..';
import {
  deleteOrganizer,
  getGameById,
  putOrganizer,
  postGameStatus,
} from '../../controllers/gamesController';
import { Game, GameStatus } from '../../types/Game';
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
    changeTournamentStatus(state, action: PayloadAction<GameStatus>) {
      state.status = action.payload;

      return state;
    },
  },
});

export default tournamentSlice.reducer;

export const {
  loadTournament,
  clearTournament,
  changeTournamentStatus,
} = tournamentSlice.actions;

export const getTournament = (id: string): AppThunk => dispatch => {
  getGameById(id).then(game => {
    dispatch(loadTournament(game));
  });
};

export const openRegistration = (): AppThunk => (dispatch, getState) => {
  postGameStatus(getState().tournament.id, GameStatus.REGISTRATION_OPEN)
    .then(() => {
      dispatch(changeTournamentStatus(GameStatus.REGISTRATION_OPEN));
      dispatch(addSnackbar('Registration open'));
    })
    .catch(() => dispatch(addSnackbar('Failed to open registration', 'error')));
};

export const closeRegistration = (): AppThunk => (dispatch, getState) => {
  postGameStatus(getState().tournament.id, GameStatus.REGISTRATION_CLOSED)
    .then(() => {
      dispatch(changeTournamentStatus(GameStatus.REGISTRATION_CLOSED));
      dispatch(addSnackbar('Registration closed'));
    })
    .catch(() =>
      dispatch(addSnackbar('Failed to close registration', 'error')),
    );
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
