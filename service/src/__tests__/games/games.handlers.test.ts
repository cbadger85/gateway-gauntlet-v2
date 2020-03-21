import Container from 'typedi';
import GameService from '../../games/games.service';
import {
  createGame,
  addPlayer,
  getGames,
  getGame,
  addOrganizer,
  removeOrganizer,
  updatePrice,
  updateDate,
  updateMissions,
  updateGameStatus,
} from '../../games/games.handlers';
import { GameStatus } from '../../games/gameStatus.model';

const mockRes = {
  json: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
};

class MockGameService {
  createGame = jest.fn();
  getGames = jest.fn();
  getGame = jest.fn();
  addOrganizer = jest.fn();
  removeOrganizer = jest.fn();
  addPlayer = jest.fn();
  updatePrice = jest.fn();
  updateDate = jest.fn();
  updateMissions = jest.fn();
  updateGameStatus = jest.fn();
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

const mockUpdatePriceRequest = {
  price: 4000,
};

const mockUpdateDateRequest = {
  date: new Date(2020, 0, 1),
  length: 1,
};

const mockUpdateMissionsRequest = {
  missions: ['mission1 1', 'mission 2'],
};

const mockUpdateGameStatusRequest = {
  status: GameStatus.REGISTRATION_OPEN,
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
      await getGames({} as any, mockRes as any, jest.fn());

      expect(gameService.getGames).toBeCalledWith();
    });

    it('should call res.json', async () => {
      const game = ['game'];

      gameService.getGames.mockResolvedValue(game);

      await getGames({} as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith(game);
    });
  });

  describe('getGame', () => {
    it('should call gameService.getGame', async () => {
      const mockReq = {
        params: {
          gameId: '1234',
        },
      };

      await getGame(mockReq as any, mockRes as any, jest.fn());

      expect(gameService.getGame).toBeCalledWith('1234');
    });

    it('should call res.json', async () => {
      const mockReq = {
        params: {
          gameId: '1234',
        },
      };

      const game = 'game';

      gameService.getGames.mockResolvedValue(game);

      await getGames(mockReq as any, mockRes as any, jest.fn());

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
          gameId: 'asdfg',
        },
      };

      await addPlayer(mockReq as any, mockRes as any, jest.fn());

      expect(gameService.addPlayer).toBeCalledWith(
        mockReq.params.gameId,
        mockAddPlayerRequest,
      );
    });

    it('should call res.json', async () => {
      const mockReq = {
        body: mockAddPlayerRequest,
        params: {
          gameId: 'asdfg',
        },
      };

      const game = 'game';

      gameService.addPlayer.mockResolvedValue(game);

      await addPlayer(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith(game);
    });
  });

  describe('addOrganizer', () => {
    it('should call gameService.addOrganizer', async () => {
      const mockReq = {
        body: { organizerId: '1234' },
        params: {
          gameId: 'asdfg',
        },
      };

      await addOrganizer(mockReq as any, mockRes as any, jest.fn());

      expect(gameService.addOrganizer).toBeCalledWith(
        mockReq.params.gameId,
        mockReq.body.organizerId,
      );
    });

    it('should call res.json', async () => {
      const mockReq = {
        body: { organizerId: '1234' },
        params: {
          gameId: 'asdfg',
        },
      };

      const game = 'game';

      gameService.addOrganizer.mockResolvedValue(game);

      await addOrganizer(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith(game);
    });
  });

  describe('removeOrganizer', () => {
    it('should call gameService.removeOrganizer', async () => {
      const mockReq = {
        params: {
          gameId: 'asdfg',
          organizerId: '1234',
        },
      };

      await removeOrganizer(mockReq as any, mockRes as any, jest.fn());

      expect(gameService.removeOrganizer).toBeCalledWith(
        mockReq.params.gameId,
        mockReq.params.organizerId,
      );
    });

    it('should call res.json', async () => {
      const mockReq = {
        params: {
          gameId: 'asdfg',
          organizerId: '1234',
        },
      };

      const game = 'game';

      gameService.removeOrganizer.mockResolvedValue(game);

      await removeOrganizer(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith(game);
    });
  });

  describe('updatePrice', () => {
    it('should call gameService.updatePrice', async () => {
      const mockReq = {
        params: {
          gameId: 'asdfg',
        },
        body: mockUpdatePriceRequest,
      };

      await updatePrice(mockReq as any, mockRes as any, jest.fn());

      expect(gameService.updatePrice).toBeCalledWith(
        mockReq.params.gameId,
        mockReq.body.price,
      );
    });

    it('should call res.json', async () => {
      const mockReq = {
        params: {
          gameId: 'asdfg',
        },
        body: mockUpdatePriceRequest,
      };

      const game = 'game';

      gameService.updatePrice.mockResolvedValue(game);

      await updatePrice(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith(game);
    });
  });

  describe('updateDate', () => {
    it('should call gameService.updatePrice', async () => {
      const mockReq = {
        params: {
          gameId: 'asdfg',
        },
        body: mockUpdateDateRequest,
      };

      await updateDate(mockReq as any, mockRes as any, jest.fn());

      expect(gameService.updateDate).toBeCalledWith(
        mockReq.params.gameId,
        mockReq.body.date,
        mockReq.body.length,
      );
    });

    it('should call res.json', async () => {
      const mockReq = {
        params: {
          gameId: 'asdfg',
        },
        body: mockUpdateDateRequest,
      };

      const game = 'game';

      gameService.updateDate.mockResolvedValue(game);

      await updateDate(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith(game);
    });
  });

  describe('updateMissions', () => {
    it('should call gameService.updateMissions', async () => {
      const mockReq = {
        params: {
          gameId: 'asdfg',
        },
        body: mockUpdateMissionsRequest,
      };

      await updateMissions(mockReq as any, mockRes as any, jest.fn());

      expect(gameService.updateMissions).toBeCalledWith(
        mockReq.params.gameId,
        mockReq.body.missions,
      );
    });

    it('should call res.json', async () => {
      const mockReq = {
        params: {
          gameId: 'asdfg',
        },
        body: mockUpdateMissionsRequest,
      };

      const game = 'game';

      gameService.updateMissions.mockResolvedValue(game);

      await updateMissions(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.json).toBeCalledWith(game);
    });
  });

  describe('updateGameStatus', () => {
    it('should call gameService.updateGameStatus', async () => {
      const mockReq = {
        params: {
          gameId: 'asdfg',
        },
        body: mockUpdateGameStatusRequest,
      };

      await updateGameStatus(mockReq as any, mockRes as any, jest.fn());

      expect(gameService.updateGameStatus).toBeCalledWith(
        mockReq.params.gameId,
        mockReq.body.status,
      );
    });

    it('should call res.json', async () => {
      const mockReq = {
        params: {
          gameId: 'asdfg',
        },
        body: mockUpdateGameStatusRequest,
      };

      gameService.updateGameStatus.mockResolvedValue(void 0);

      await updateGameStatus(mockReq as any, mockRes as any, jest.fn());

      expect(mockRes.sendStatus).toBeCalledWith(204);
    });
  });
});
