import Container from 'typedi';
import GameService from '../../games/games.service';
import { createGame, addPlayer, getGames } from '../../games/games.handlers';

const mockRes = {
  json: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
};

class MockGameService {
  createGame = jest.fn();
  getGames = jest.fn();
  addOrganizer = jest.fn();
  addPlayer = jest.fn();
}

const mockGameRequest = {
  name: 'foo game',
  organizerIds: ['12345'],
};

const mockAddPlayerRequest = {
  name: 'foo bar',
  itsName: 'foobar',
  itsPin: 'qwerty',
  email: 'foo@fexample.com',
  city: 'fooville',
  state: 'FL',
  paid: true,
  attending: true,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('games.handlers', () => {
  let gameService: MockGameService;

  beforeAll(() => {
    Container.set(GameService, new MockGameService());
    gameService = (Container.get(GameService) as unknown) as MockGameService;
  });

  describe('getGames', () => {
    it('should call gameService.getGames', async () => {
      const mockReq = {
        body: mockGameRequest,
      };

      await getGames(mockReq as any, mockRes as any, jest.fn());

      expect(gameService.getGames).toBeCalledWith();
    });

    it('should call res.json', async () => {
      const game = ['game'];

      gameService.getGames.mockResolvedValue(game);

      await getGames({} as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith(game);
    });
  });

  describe('createGame', () => {
    it('should call gameService.createGame', async () => {
      const mockReq = {
        body: mockGameRequest,
      };

      await createGame(mockReq as any, mockRes as any, jest.fn());

      expect(gameService.createGame).toBeCalledWith(mockGameRequest);
    });

    it('should call res.json', async () => {
      const mockReq = {
        body: mockGameRequest,
      };

      const game = 'game';

      gameService.createGame.mockResolvedValue(game);

      await createGame(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith(game);
    });
  });

  describe('addPlayer', () => {
    it('should call gameService.addPlayer', async () => {
      const mockReq = {
        body: mockAddPlayerRequest,
        params: {
          id: 'asdfg',
        },
      };

      await addPlayer(mockReq as any, mockRes as any, jest.fn());

      expect(gameService.addPlayer).toBeCalledWith(
        mockReq.params.id,
        mockAddPlayerRequest,
      );
    });

    it('should call res.json', async () => {
      const mockReq = {
        body: mockAddPlayerRequest,
        params: {
          id: 'asdfg',
        },
      };

      const game = 'game';

      gameService.addPlayer.mockResolvedValue(game);

      await createGame(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith(game);
    });
  });
});
