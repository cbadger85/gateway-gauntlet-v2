import request from 'supertest';
import { Container } from 'typedi';
import uuid from 'uuid/v4';
import AuthService from '../../auth/auth.service';
import { Role } from '../../auth/models/Role';
import GameService from '../../games/games.service';
import server from '../../server';

class MockGameService {
  createGame = jest.fn();
  addOrganizer = jest.fn();
  addPlayer = jest.fn();
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

  describe('Post /games', () => {
    it('should call create a game', async () => {
      authService.refresh.mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
        user: { id: '1', roles: [Role.ORGANIZER] },
      });

      const gameRequest = { name: 'fooGame', organizerIds: [uuid()] };

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

      const gameRequest = { name: 'foo game', organizerIds: [uuid()] };

      const game = { game: 'game' };

      gameService.createGame.mockResolvedValue(game);

      await request(await server())
        .post('/games')
        .send(gameRequest)
        .expect(403);
    });
  });

  describe('POST games/:id', () => {
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
        .post(`/games/${gameId}`)
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
        .post(`/games/${gameId}`)
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
        .post(`/games/111`)
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
        .post(`/games/${gameId}`)
        .send(addPlayerRequest)
        .expect(403);
    });
  });
});
