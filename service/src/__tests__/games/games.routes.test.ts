import request from 'supertest';
import { Container } from 'typedi';
import uuid from 'uuid/v4';
import AuthService from '../../auth/auth.service';
import { Role } from '../../auth/Role.model';
import GameService from '../../games/games.service';
import server from '../../server';
import NotAuthorized from '../../errors/NotAuthorized';
import { GameStatus } from '../../games/gameStatus.model';

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

class MockAuthService {
  login = jest.fn();
  refresh = jest.fn();
}

beforeEach(jest.clearAllMocks);

describe('games.routes', () => {
  let gameService: MockGameService;
  let authService: MockAuthService;

  beforeEach(() => {
    Container.set(GameService, new MockGameService());
    Container.set(AuthService, new MockAuthService());
    gameService = (Container.get(GameService) as unknown) as MockGameService;
    authService = (Container.get(AuthService) as unknown) as MockAuthService;
  });

  describe('GET /games', () => {
    it('should call getGames', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const games = [{ game: 'game' }];

      gameService.getGames.mockResolvedValue(games);

      const response = await request(await server())
        .get('/games')
        .expect(200);

      expect(gameService.getGames).toBeCalledWith();
      expect(response.body).toEqual(games);
    });

    it('should send a 401 if the user is not logged in', async () => {
      authService.refresh.mockRejectedValue(new NotAuthorized());

      await request(await server())
        .get('/games')
        .expect(401);
    });

    it('should send a 403 if the user does not have the right role', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.USER] },
      });

      await request(await server())
        .get('/games')
        .expect(403);
    });
  });

  describe('GET /game/:gameId', () => {
    it('should call getGame', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const games = { game: 'game' };

      gameService.getGame.mockResolvedValue(games);

      const gameId = uuid();

      const response = await request(await server())
        .get(`/games/${gameId}`)
        .expect(200);

      expect(gameService.getGame).toBeCalledWith(gameId);
      expect(response.body).toEqual(games);
    });

    it('should send a 401 if the user is not logged in', async () => {
      authService.refresh.mockRejectedValue(new NotAuthorized());

      const gameId = uuid();

      await request(await server())
        .get(`/games/${gameId}`)
        .expect(401);
    });

    it('should send a 403 if the user does not have the right role', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.USER] },
      });

      const gameId = uuid();

      await request(await server())
        .get(`/games/${gameId}`)
        .expect(403);
    });

    it('should send a 400 if the uuid is invalid', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      await request(await server())
        .get(`/games/1234`)
        .expect(400);
    });
  });

  describe('POST /games', () => {
    it('should call createGame', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const gameRequest = {
        name: 'fooGame',
        organizerIds: [uuid()],
        date: new Date(Date.now()),
        missions: ['mission'],
      };

      const game = { game: 'game' };

      gameService.createGame.mockResolvedValue(game);

      const response = await request(await server())
        .post('/games')
        .send(gameRequest)
        .expect(200);

      expect(gameService.createGame).toBeCalledWith(gameRequest);
      expect(response.body).toEqual(game);
    });

    it('should send a 400 if the request is bad', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const gameRequest = { name: '', organizerIds: [uuid()] };

      const game = { game: 'game' };

      gameService.createGame.mockResolvedValue(game);

      await request(await server())
        .post('/games')
        .send(gameRequest)
        .expect(400);
    });

    it('should send a 403 if user does not have the right role', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.USER] },
      });

      const gameRequest = {
        name: 'foo game',
        organizerIds: [uuid()],
        date: new Date(Date.now()),
        missions: ['mission'],
      };

      const game = { game: 'game' };

      gameService.createGame.mockResolvedValue(game);

      await request(await server())
        .post('/games')
        .send(gameRequest)
        .expect(403);
    });
  });

  describe('PUT games/:gameId/players', () => {
    it('should add a player to a game', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const addPlayerRequest = {
        name: 'foo bar',
        itsName: 'foobar',
        itsPin: 'qwerty',
        email: 'foo@fexample.com',
        city: 'fooville',
        state: 'FL',
        paid: true,
        attending: true,
      };

      const game = { game: 'game' };
      const gameId = uuid();

      gameService.addPlayer.mockResolvedValue(game);

      const response = await request(await server())
        .put(`/games/${gameId}/players`)
        .send(addPlayerRequest)
        .expect(200);

      expect(gameService.addPlayer).toBeCalledWith(gameId, addPlayerRequest);
      expect(response.body).toEqual(game);
    });

    it('should send a 400 if the request is bad', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const addPlayerRequest = {
        itsName: 'foobar',
        itsPin: 'qwerty',
        email: 'foo2',
        city: 'fooville',
        state: 'FL',
        paid: true,
        attending: true,
      };

      const game = { game: 'game' };
      const gameId = uuid();

      gameService.addPlayer.mockResolvedValue(game);

      await request(await server())
        .put(`/games/${gameId}/players`)
        .send(addPlayerRequest)
        .expect(400);
    });

    it('should send a 400 if the url has a bad uuid', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const addPlayerRequest = {
        name: 'foo bar',
        itsName: 'foobar',
        itsPin: 'qwerty',
        email: 'foo@fexample.com',
        city: 'fooville',
        state: 'FL',
        paid: true,
        attending: true,
      };

      const game = { game: 'game' };

      gameService.addPlayer.mockResolvedValue(game);

      await request(await server())
        .put(`/games/111/players`)
        .send(addPlayerRequest)
        .expect(400);
    });

    it('should send a 403 if the user does not have the right role', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.USER] },
      });

      const addPlayerRequest = {
        name: 'foo bar',
        itsName: 'foobar',
        itsPin: 'qwerty',
        email: 'foo@fexample.com',
        city: 'fooville',
        state: 'FL',
        paid: true,
        attending: true,
      };

      const game = { game: 'game' };
      const gameId = uuid();

      gameService.addPlayer.mockResolvedValue(game);

      await request(await server())
        .put(`/games/${gameId}/players`)
        .send(addPlayerRequest)
        .expect(403);
    });
  });

  describe('PUT games/:gameId/organizers', () => {
    it('should add an organizer to a game', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const organizerId = uuid();
      const organizerRequest = { organizerId };

      const game = { game: 'game' };
      const gameId = uuid();

      gameService.addOrganizer.mockResolvedValue(game);

      const response = await request(await server())
        .put(`/games/${gameId}/organizers`)
        .send(organizerRequest)
        .expect(200);

      expect(gameService.addOrganizer).toBeCalledWith(gameId, organizerId);
      expect(response.body).toEqual(game);
    });

    it('should send a 400 if the request is bad', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const organizerRequest = { organizerId: '1111' };

      const game = { game: 'game' };
      const gameId = uuid();

      gameService.addOrganizer.mockResolvedValue(game);

      await request(await server())
        .put(`/games/${gameId}/organizers`)
        .send(organizerRequest)
        .expect(400);
    });

    it('should send a 400 if the url has a bad uuid', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const organizerId = uuid();
      const organizerRequest = { organizerId };

      const game = { game: 'game' };

      gameService.addOrganizer.mockResolvedValue(game);

      await request(await server())
        .put(`/games/111/organizers`)
        .send(organizerRequest)
        .expect(400);
    });

    it('should send a 403 if the user does not have the right role', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.USER] },
      });

      const organizerId = uuid();
      const organizerRequest = { organizerId };

      const game = { game: 'game' };
      const gameId = uuid();

      gameService.addOrganizer.mockResolvedValue(game);

      await request(await server())
        .put(`/games/${gameId}/organizers`)
        .send(organizerRequest)
        .expect(403);
    });
  });

  describe('DELETE games/:gameId/organizers/:organizerId', () => {
    it('should add an organizer to a game', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const organizerId = uuid();

      const game = { game: 'game' };
      const gameId = uuid();

      gameService.removeOrganizer.mockResolvedValue(game);

      const response = await request(await server())
        .delete(`/games/${gameId}/organizers/${organizerId}`)
        .expect(200);

      expect(gameService.removeOrganizer).toBeCalledWith(gameId, organizerId);
      expect(response.body).toEqual(game);
    });

    it('should send a 400 if the url has a bad uuid', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const game = { game: 'game' };

      gameService.removeOrganizer.mockResolvedValue(game);

      await request(await server())
        .delete(`/games/111/organizers/222`)
        .expect(400);
    });

    it('should send a 403 if the user does not have the right role', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.USER] },
      });

      const organizerId = uuid();

      const game = { game: 'game' };
      const gameId = uuid();

      gameService.removeOrganizer.mockResolvedValue(game);

      await request(await server())
        .delete(`/games/${gameId}/organizers/${organizerId}`)
        .expect(403);
    });
  });

  describe('PUT games/:gameId/price', () => {
    it('should update the game price', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const game = { game: 'game' };
      const gameId = uuid();
      const updatePriceRequest = { price: 4000 };

      gameService.updatePrice.mockResolvedValue(game);

      const response = await request(await server())
        .put(`/games/${gameId}/price`)
        .send(updatePriceRequest)
        .expect(200);

      expect(gameService.updatePrice).toBeCalledWith(
        gameId,
        updatePriceRequest.price,
      );
      expect(response.body).toEqual(game);
    });

    it('should send a 400 if the url has a bad uuid', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const game = { game: 'game' };
      const updatePriceRequest = { price: 4000 };

      gameService.updatePrice.mockResolvedValue(game);

      await request(await server())
        .put(`/games/111/price`)
        .send(updatePriceRequest)
        .expect(400);
    });

    it('should send a 400 if the request is invalid', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const game = { game: 'game' };
      const gameId = uuid();
      const updatePriceRequest = { price: -1 };

      gameService.updatePrice.mockResolvedValue(game);

      await request(await server())
        .put(`/games/${gameId}/price`)
        .send(updatePriceRequest)
        .expect(400);
    });

    it('should send a 403 if the user does not have the right role', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.USER] },
      });

      const game = { game: 'game' };
      const gameId = uuid();
      const updatePriceRequest = { price: 4000 };

      gameService.updatePrice.mockResolvedValue(game);

      await request(await server())
        .put(`/games/${gameId}/price`)
        .send(updatePriceRequest)
        .expect(403);
    });
  });

  describe('PUT games/:gameId/date', () => {
    it('should update the game date', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const game = { game: 'game' };
      const gameId = uuid();
      const updateDateRequest = {
        date: new Date(2020, 0, 1),
        length: 1,
      };

      gameService.updateDate.mockResolvedValue(game);

      const response = await request(await server())
        .put(`/games/${gameId}/date`)
        .send(updateDateRequest)
        .expect(200);

      expect(gameService.updateDate).toBeCalledWith(
        gameId,
        updateDateRequest.date,
        updateDateRequest.length,
      );
      expect(response.body).toEqual(game);
    });

    it('should send a 400 if the url has a bad uuid', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const game = { game: 'game' };
      const updateDateRequest = {
        date: new Date(2020, 0, 1),
        length: 1,
      };

      gameService.updateDate.mockResolvedValue(game);

      await request(await server())
        .put(`/games/111/date`)
        .send(updateDateRequest)
        .expect(400);
    });

    it('should send a 400 request is invalid', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const game = { game: 'game' };
      const gameId = uuid();
      const updateDateRequest = {
        date: 'aaa',
        length: -1,
      };

      gameService.updateDate.mockResolvedValue(game);

      await request(await server())
        .put(`/games/${gameId}/date`)
        .send(updateDateRequest)
        .expect(400);
    });

    it('should send a 403 if the user does not have the right role', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.USER] },
      });

      const game = { game: 'game' };
      const gameId = uuid();
      const updateDateRequest = {
        date: new Date(2020, 0, 1),
        length: 1,
      };

      gameService.updateDate.mockResolvedValue(game);

      await request(await server())
        .put(`/games/${gameId}/date`)
        .send(updateDateRequest)
        .expect(403);
    });
  });

  describe('PUT games/:gameId/missions', () => {
    it('should update the game missions', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const game = { game: 'game' };
      const gameId = uuid();
      const updateMissionsRequest = {
        missions: ['mission1 1', 'mission 2'],
      };

      gameService.updateMissions.mockResolvedValue(game);

      const response = await request(await server())
        .put(`/games/${gameId}/missions`)
        .send(updateMissionsRequest)
        .expect(200);

      expect(gameService.updateMissions).toBeCalledWith(
        gameId,
        updateMissionsRequest.missions,
      );
      expect(response.body).toEqual(game);
    });

    it('should send a 400 if the url has a bad uuid', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const game = { game: 'game' };
      const updateMissionsRequest = {
        missions: ['mission1 1', 'mission 2'],
      };

      gameService.updateMissions.mockResolvedValue(game);

      await request(await server())
        .put(`/games/111/missions`)
        .send(updateMissionsRequest)
        .expect(400);
    });

    it('should send a 400 request is invalid', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const game = { game: 'game' };
      const gameId = uuid();
      const updateMissionsRequest = {
        missions: [],
      };

      gameService.updateMissions.mockResolvedValue(game);

      await request(await server())
        .put(`/games/${gameId}/missions`)
        .send(updateMissionsRequest)
        .expect(400);
    });

    it('should send a 403 if the user does not have the right role', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.USER] },
      });

      const game = { game: 'game' };
      const gameId = uuid();
      const updateMissionsRequest = {
        missions: ['mission1 1', 'mission 2'],
      };

      gameService.updateMissions.mockResolvedValue(game);

      await request(await server())
        .put(`/games/${gameId}/missions`)
        .send(updateMissionsRequest)
        .expect(403);
    });
  });

  describe('PUT games/:gameId/status', () => {
    it('should update the game status', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const game = { game: 'game' };
      const gameId = uuid();
      const updateStatusRequest = {
        status: GameStatus.REGISTRATION_OPEN,
      };

      gameService.updateGameStatus.mockResolvedValue(game);

      const response = await request(await server())
        .put(`/games/${gameId}/status`)
        .send(updateStatusRequest)
        .expect(200);

      expect(gameService.updateGameStatus).toBeCalledWith(
        gameId,
        GameStatus.REGISTRATION_OPEN,
      );
      expect(response.body).toEqual(game);
    });

    it('should send a 400 if the url has a bad uuid', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const game = { game: 'game' };
      const updateStatusRequest = {
        status: GameStatus.REGISTRATION_OPEN,
      };

      gameService.updateGameStatus.mockResolvedValue(game);

      await request(await server())
        .put(`/games/111/status`)
        .send(updateStatusRequest)
        .expect(400);
    });

    it('should send a 400 request is invalid', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const game = { game: 'game' };
      const gameId = uuid();
      const updateStatusRequest = {
        status: 'open',
      };

      gameService.updateGameStatus.mockResolvedValue(game);

      await request(await server())
        .put(`/games/${gameId}/status`)
        .send(updateStatusRequest)
        .expect(400);
    });

    it('should send a 403 if the user does not have the right role', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.USER] },
      });

      const game = { game: 'game' };
      const gameId = uuid();
      const updateStatusRequest = {
        status: GameStatus.REGISTRATION_OPEN,
      };

      gameService.updateGameStatus.mockResolvedValue(game);

      await request(await server())
        .put(`/games/${gameId}/status`)
        .send(updateStatusRequest)
        .expect(403);
    });
  });
});
