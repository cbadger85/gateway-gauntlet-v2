import { AddTournamentFieldData } from '../../components/AddTournamentForm';
import axios from '../../controllers/axios';
import { getGames, postGame } from '../../controllers/gamesController';

jest.mock('../../controllers/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
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
});
