import { AddTournamentFieldData } from '../../components/AddTournamentForm';
import axios from '../../controllers/axios';
import {
  getGames,
  postGame,
  getGameById,
  putOrganizer,
  deleteOrganizer,
  putPrice,
} from '../../controllers/gamesController';

jest.mock('../../controllers/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

beforeEach(jest.clearAllMocks);

describe('gamesController', () => {
  describe('postGame', () => {
    it('should call axios with AddTournamentFieldData', async () => {
      (axios.post as jest.Mock).mockResolvedValue({ data: 'game' });

      const addTournamentFieldData: AddTournamentFieldData = {
        name: 'tournament 1',
        date: new Date(Date.now()),
        missions: ['mission 1'],
        organizerIds: ['111'],
      };

      await postGame(addTournamentFieldData);

      const url = `${process.env.REACT_APP_BASE_URL}/games`;

      expect(axios.post).toBeCalledWith(url, addTournamentFieldData);
    });
  });

  describe('getGames', () => {
    it('should call axios with the url', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: ['game'] });

      await getGames();

      const url = `${process.env.REACT_APP_BASE_URL}/games`;

      expect(axios.get).toBeCalledWith(url);
    });
  });

  describe('getGameById', () => {
    it('should call axios with the url', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: 'game' });
      const gameId = '1234';

      await getGameById(gameId);

      const url = `${process.env.REACT_APP_BASE_URL}/games/${gameId}`;

      expect(axios.get).toBeCalledWith(url);
    });
  });

  describe('putPrice', () => {
    it('should call axios with the url and organizerId', async () => {
      (axios.put as jest.Mock).mockResolvedValue({ data: 'game' });
      const gameId = '1234';

      await putPrice(gameId, 4000);

      const url = `${process.env.REACT_APP_BASE_URL}/games/${gameId}/price`;

      expect(axios.put).toBeCalledWith(url, { price: 4000 });
    });
  });

  describe('putOrganizer', () => {
    it('should call axios with the url and organizerId', async () => {
      (axios.put as jest.Mock).mockResolvedValue({ data: 'game' });
      const gameId = '1234';
      const organizerId = '5678';

      await putOrganizer(gameId, organizerId);

      const url = `${process.env.REACT_APP_BASE_URL}/games/${gameId}/organizers`;

      expect(axios.put).toBeCalledWith(url, { organizerId });
    });
  });

  describe('deleteOrganizer', () => {
    it('should call axios with the url', async () => {
      (axios.delete as jest.Mock).mockResolvedValue({ data: 'game' });
      const gameId = '1234';
      const organizerId = '5678';

      await deleteOrganizer(gameId, organizerId);

      const url = `${process.env.REACT_APP_BASE_URL}/games/${gameId}/organizers/${organizerId}`;

      expect(axios.delete).toBeCalledWith(url);
    });
  });
});
