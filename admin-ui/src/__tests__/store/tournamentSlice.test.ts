import { Game, GameStatus } from '../../types/Game';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import configureStore from 'redux-mock-store';
import tournamentReducer, {
  loadTournament,
  clearTournament,
  getTournament,
  addOrganizer,
  removeOrganizer,
} from '../../store/tournament/tournamentSlice';
import {
  getGameById,
  putOrganizer,
  deleteOrganizer,
} from '../../controllers/gamesController';
import { addSnackbar } from '../../store/alert/alertSlice';

jest.mock('../../store');

jest.mock('../../controllers/gamesController', () => ({
  getGameById: jest.fn(),
  putOrganizer: jest.fn(),
  deleteOrganizer: jest.fn(),
}));

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

const mockOrganizer1 = { id: '456', name: 'foo bar', email: 'bar@email.com' };
const mockOrganizer2 = { id: '789', name: 'foo baz', email: 'baz@email.com' };

const mockGame: Game = {
  id: '123',
  name: 'tournament',
  date: '1/1/20',
  length: 1,
  organizers: [mockOrganizer1],
  missions: ['mission 1', 'mission 2'],
  players: [],
  status: GameStatus.NEW,
  price: 4000,
};

const mockGame2: Game = {
  id: '123',
  name: 'tournament',
  date: '1/1/20',
  length: 1,
  organizers: [mockOrganizer1, mockOrganizer2],
  missions: ['mission 1', 'mission 2'],
  players: [],
  status: GameStatus.NEW,
  price: 4000,
};

const mockStore = configureStore([...getDefaultMiddleware()]);

describe('tournamentSlice', () => {
  describe('tournamentReducer', () => {
    it('should load the tournament', () => {
      const tournament = tournamentReducer(initialState, {
        type: loadTournament.type,
        payload: mockGame,
      });

      expect(tournament).toEqual(mockGame);
    });

    it('should clear the tournament', () => {
      const tournament = tournamentReducer(mockGame, {
        type: clearTournament.type,
      });

      expect(tournament).toEqual(initialState);
    });
  });

  describe('getTournament', () => {
    it('should call getGameById', async () => {
      (getGameById as jest.Mock).mockResolvedValue(mockGame);

      const store = mockStore({ organizers: undefined });

      await store.dispatch(getTournament(mockGame.id) as any);

      expect(getGameById).toBeCalledWith(mockGame.id);
    });

    it('should dispatch loadTournament', async () => {
      (getGameById as jest.Mock).mockResolvedValue(mockGame);

      const store = mockStore({ organizers: undefined });

      await store.dispatch(getTournament(mockGame.id) as any);

      const loadTournamentAction = {
        type: loadTournament.type,
        payload: mockGame,
      };

      expect(store.getActions()).toEqual([loadTournamentAction]);
    });
  });

  describe('addOrganizer', () => {
    it('should call putOrganizer', async () => {
      (putOrganizer as jest.Mock).mockResolvedValue(mockGame2);

      const store = mockStore({ tournament: undefined, alert: [] });

      await store.dispatch(addOrganizer(mockGame.id, mockOrganizer2.id) as any);

      expect(putOrganizer).toBeCalledWith(mockGame.id, mockOrganizer2.id);
    });

    it('should load the tournament and snackbar if successful', async () => {
      (putOrganizer as jest.Mock).mockResolvedValue(mockGame2);

      const store = mockStore({ tournament: undefined, alert: [] });

      await store.dispatch(addOrganizer(mockGame.id, mockOrganizer2.id) as any);

      const loadTournamentAction = {
        type: loadTournament.type,
        payload: mockGame2,
      };

      const addSnackbarAction = {
        type: addSnackbar.type,
        payload: {
          id: expect.any(String),
          message: expect.any(String),
          severity: 'success',
        },
      };

      expect(store.getActions()).toEqual([
        loadTournamentAction,
        addSnackbarAction,
      ]);
    });

    it('should load the snackbar if unsuccessful', async () => {
      (putOrganizer as jest.Mock).mockRejectedValue(new Error());

      const store = mockStore({ tournament: undefined, alert: [] });

      await store.dispatch((async (dispatch: any) => {
        dispatch(addOrganizer(mockGame.id, mockOrganizer2.id));
      }) as any);

      const addSnackbarAction = {
        type: addSnackbar.type,
        payload: {
          id: expect.any(String),
          message: expect.any(String),
          severity: 'error',
        },
      };

      expect(store.getActions()).toEqual([addSnackbarAction]);
    });
  });

  describe('removeOrganizer', () => {
    it('should call deleteOrganizer', async () => {
      (deleteOrganizer as jest.Mock).mockResolvedValue(mockGame);

      const store = mockStore({ tournament: undefined, alert: [] });

      await store.dispatch(
        removeOrganizer(mockGame2.id, mockOrganizer2.id) as any,
      );

      expect(deleteOrganizer).toBeCalledWith(mockGame2.id, mockOrganizer2.id);
    });

    it('should load the tournament and snackbar if successful', async () => {
      (deleteOrganizer as jest.Mock).mockResolvedValue(mockGame);

      const store = mockStore({ tournament: undefined, alert: [] });

      await store.dispatch(
        removeOrganizer(mockGame2.id, mockOrganizer2.id) as any,
      );

      const loadTournamentAction = {
        type: loadTournament.type,
        payload: mockGame,
      };

      const addSnackbarAction = {
        type: addSnackbar.type,
        payload: {
          id: expect.any(String),
          message: expect.any(String),
          severity: 'success',
        },
      };

      expect(store.getActions()).toEqual([
        loadTournamentAction,
        addSnackbarAction,
      ]);
    });

    it('should load the snackbar if unsuccessful', async () => {
      (deleteOrganizer as jest.Mock).mockRejectedValue(new Error());

      const store = mockStore({ tournament: undefined, alert: [] });

      await store.dispatch((async (dispatch: any) => {
        dispatch(removeOrganizer(mockGame2.id, mockOrganizer2.id));
      }) as any);

      const addSnackbarAction = {
        type: addSnackbar.type,
        payload: {
          id: expect.any(String),
          message: expect.any(String),
          severity: 'error',
        },
      };

      expect(store.getActions()).toEqual([addSnackbarAction]);
    });
  });
});
