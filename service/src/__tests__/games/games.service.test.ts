import Container from 'typedi';
import GameService from '../../games/games.service';
import Player from '../../players/players.entity';
import User from '../../users/users.entity';
import { Role } from '../../auth/Role.model';
import Game from '../../games/games.entity';
import Organizer from '../../games/organizer.dto';
import NotFound from '../../errors/NotFound';
import BadRequest from '../../errors/BadRequest';

class MockGameRepository {
  findAllGames = jest.fn();
  findGameById = jest.fn();
  saveGame = jest.fn();
}

class MockUserRepository {
  findUser = jest.fn();
  findUsersByIds = jest.fn();
}

class MockPlayerRepository {
  findPlayerByItsPin = jest.fn();
}

const player1 = new Player();
player1.name = 'foo';
player1.attending = true;
player1.paid = true;
player1.city = 'fooville';
player1.state = 'FL';
player1.email = 'foo@example.com';
player1.itsName = 'foobar';
player1.itsPin = 'abcdef';
player1.shortCode = '11111';
player1.id = '12345';

const user = new User();

user.username = 'foo';
user.password = 'bar';
user.roles = [Role.USER];
user.sessionId = '1234';
user.email = 'foo@example.com';
user.firstName = 'foo';
user.lastName = 'bar';
user.id = '67890';

const user2 = new User();

user2.username = 'baz';
user2.password = 'bar';
user2.roles = [Role.USER];
user2.sessionId = '6789';
user2.email = 'foo2@example.com';
user2.firstName = 'foo';
user2.lastName = 'bar';
user2.id = '54321';

beforeEach(jest.clearAllMocks);

describe('GameService', () => {
  const mockGameRepository = new MockGameRepository();
  const mockPlayerRepository = new MockPlayerRepository();
  const mockUserRepository = new MockUserRepository();
  let gameService = new GameService(
    mockGameRepository as any,
    mockUserRepository as any,
    mockPlayerRepository as any,
  );

  describe('createGame', () => {
    it('should call userRepository.findUsersByIds', async () => {
      const createGameRequest = {
        name: 'foo game',
        organizerIds: ['67890'],
        date: new Date(Date.now()),
        missions: ['mission'],
      };
      await gameService.createGame(createGameRequest);

      expect(mockUserRepository.findUsersByIds).toBeCalledWith(
        createGameRequest.organizerIds,
      );
    });

    it('should call gameRepository.saveGame', async () => {
      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [player1];

      mockUserRepository.findUsersByIds.mockResolvedValue([user]);

      const createGameRequest = {
        name: game.name,
        organizerIds: [user.id],
        date: new Date(Date.now()),
        missions: ['mission'],
      };
      await gameService.createGame(createGameRequest);

      const newGame = { name: game.name, users: [user] };

      expect(mockGameRepository.saveGame).toBeCalledWith(newGame);
    });

    it('should return a game', async () => {
      mockUserRepository.findUsersByIds.mockResolvedValue([user]);
      const game = new Game();
      game.id = '12345';
      game.name = 'foo game';
      game.users = [user];
      mockGameRepository.saveGame.mockResolvedValue(game);

      const createGameRequest = {
        name: game.name,
        organizerIds: [user.id],
        date: new Date(Date.now()),
        missions: ['mission'],
      };

      const createdGame = await gameService.createGame(createGameRequest);

      const organizer = new Organizer(user);

      expect(createdGame).toEqual({
        id: game.id,
        name: game.name,
        organizers: [organizer],
      });
    });
  });

  describe('addOrganizer', () => {
    it('should call gameRepository.findGameById', async () => {
      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [player1];

      mockGameRepository.findGameById.mockResolvedValue(game);
      mockUserRepository.findUser.mockResolvedValue(user2);

      await gameService.addOrganizer(game.id, user2.id);

      expect(mockGameRepository.findGameById).toBeCalledWith(game.id);
    });

    it('should call userRepository.findUser', async () => {
      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [player1];

      mockGameRepository.findGameById.mockResolvedValue(game);
      mockUserRepository.findUser.mockResolvedValue(user2);

      await gameService.addOrganizer(game.id, user2.id);

      expect(mockUserRepository.findUser).toBeCalledWith(user2.id);
    });

    it('should call gameRepository.saveGame', async () => {
      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [player1];

      mockGameRepository.findGameById.mockResolvedValue(game);
      mockUserRepository.findUser.mockResolvedValue(user2);

      await gameService.addOrganizer(game.id, user2.id);

      expect(mockGameRepository.saveGame).toBeCalledWith(game);
      expect(game.users).toHaveLength(2);
    });

    it('should call return a game with the new organizer added', async () => {
      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [player1];

      const game2 = new Game();
      game2.name = 'foo game';
      game2.id = '34567';
      game2.users = [user, user2];
      game2.players = [player1];

      mockGameRepository.findGameById.mockResolvedValue(game);
      mockUserRepository.findUser.mockResolvedValue(user2);
      mockGameRepository.saveGame.mockResolvedValue(game2);

      const savedGame = await gameService.addOrganizer(game.id, user2.id);

      const organizer1 = new Organizer(user);
      const organizer2 = new Organizer(user2);

      expect(savedGame).toEqual({
        id: game.id,
        name: game.name,
        players: game.players,
        organizers: [organizer1, organizer2],
      });
    });

    it('should throw a NotFound if the game cannot be found', async () => {
      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [player1];

      mockGameRepository.findGameById.mockResolvedValue(undefined);

      const error = await gameService
        .addOrganizer(game.id, user2.id)
        .catch(e => e);

      expect(error).toBeInstanceOf(NotFound);
    });

    it('should throw a NotFound if the user cannot be found', async () => {
      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [player1];

      mockGameRepository.findGameById.mockResolvedValue(game);
      mockUserRepository.findUser.mockResolvedValue(undefined);

      const error = await gameService
        .addOrganizer(game.id, user2.id)
        .catch(e => e);

      expect(error).toBeInstanceOf(NotFound);
    });

    it('should throw a BadRequest if the has already been added as an organizer', async () => {
      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [player1];

      mockGameRepository.findGameById.mockResolvedValue(game);
      mockUserRepository.findUser.mockResolvedValue(user);

      const error = await gameService
        .addOrganizer(game.id, user.id)
        .catch(e => e);

      expect(error).toBeInstanceOf(BadRequest);
    });
  });

  describe('addPlayer', () => {
    it('should call gameRepository.findGameById', async () => {
      const player2 = new Player();
      player2.name = 'foo bar';
      player1.attending = true;
      player2.paid = true;
      player2.city = 'fooville';
      player2.state = 'FL';
      player2.email = 'foo@example.com';
      player2.itsName = 'foobar';
      player2.itsPin = 'qwerty';
      player2.shortCode = '22222';
      player2.id = '09876';

      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [player1];

      mockGameRepository.findGameById.mockResolvedValue(game);
      mockPlayerRepository.findPlayerByItsPin.mockResolvedValue(undefined);

      await gameService.addPlayer(game.id, player2);

      expect(mockGameRepository.findGameById).toBeCalledWith(game.id);
    });

    it('should call playerRepository.findPlayerByItsPin', async () => {
      const player2 = new Player();
      player2.name = 'foo bar';
      player1.attending = true;
      player2.paid = true;
      player2.city = 'fooville';
      player2.state = 'FL';
      player2.email = 'foo@example.com';
      player2.itsName = 'foobar';
      player2.itsPin = 'qwerty';
      player2.id = '09876';

      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [player1];

      mockGameRepository.findGameById.mockResolvedValue(game);
      mockPlayerRepository.findPlayerByItsPin.mockResolvedValue(undefined);

      await gameService.addPlayer(game.id, player2);

      expect(mockPlayerRepository.findPlayerByItsPin).toBeCalledWith(
        player2.itsPin,
      );
    });

    it('should call repository.save', async () => {
      const player2 = new Player();
      player2.name = 'foo bar';
      player1.attending = true;
      player2.paid = true;
      player2.city = 'fooville';
      player2.state = 'FL';
      player2.email = 'foo@example.com';
      player2.itsName = 'foobar';
      player2.itsPin = 'qwerty';
      player2.id = '09876';

      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [player1];

      mockGameRepository.findGameById.mockResolvedValue(game);
      mockPlayerRepository.findPlayerByItsPin.mockResolvedValue(undefined);

      await gameService.addPlayer(game.id, player2);

      expect(mockGameRepository.saveGame).toBeCalledWith(game);
      expect(game.players).toHaveLength(2);
    });

    it('should return a game', async () => {
      const player2 = new Player();
      player2.name = 'foo bar';
      player1.attending = true;
      player2.paid = true;
      player2.city = 'fooville';
      player2.state = 'FL';
      player2.email = 'foo@example.com';
      player2.itsName = 'foobar';
      player2.itsPin = 'qwerty';
      player2.id = '09876';

      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [];

      mockGameRepository.findGameById.mockResolvedValue(game);
      mockPlayerRepository.findPlayerByItsPin.mockResolvedValue(undefined);
      mockGameRepository.saveGame.mockResolvedValue(game);

      await gameService.addPlayer(game.id, player2);

      expect(game.players[0]).toEqual({
        ...player2,
        shortCode: expect.any(String),
      });
    });

    it('should update a player if found in db', async () => {
      const player2 = new Player();
      player2.name = 'foo bar';
      player1.attending = true;
      player2.paid = true;
      player2.city = 'fooville';
      player2.state = 'FL';
      player2.email = 'foo@example.com';
      player2.itsName = 'foobar';
      player2.itsPin = 'qwerty';
      player2.id = '09876';
      player2.shortCode = '12212';

      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [];

      mockGameRepository.findGameById.mockResolvedValue(game);
      mockPlayerRepository.findPlayerByItsPin.mockResolvedValue(player2);
      mockGameRepository.saveGame.mockResolvedValue(game);

      const player2Updated = { ...player2, name: 'bar baz' };

      await gameService.addPlayer(game.id, player2Updated);

      expect(game.players[0].name).toBe(player2Updated.name);
      expect(game.players[0].shortCode).not.toBe(player2.shortCode);
    });

    it('should throw a not found if the game does not exist', async () => {
      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [player1];

      const player2 = new Player();
      player2.name = 'foo bar';
      player1.attending = true;
      player2.paid = true;
      player2.city = 'fooville';
      player2.state = 'FL';
      player2.email = 'foo@example.com';
      player2.itsName = 'foobar';
      player2.itsPin = 'qwerty';
      player2.id = '09876';
      player2.shortCode = '12212';

      mockGameRepository.findGameById.mockResolvedValue(undefined);
      mockPlayerRepository.findPlayerByItsPin.mockResolvedValue(player2);
      mockGameRepository.saveGame.mockResolvedValue(game);

      const error = await gameService.addPlayer(game.id, player2).catch(e => e);

      expect(error).toBeInstanceOf(NotFound);
    });

    it('should throw a BadRequest if the player is already attached to the game', async () => {
      const game = new Game();
      game.name = 'foo game';
      game.id = '34567';
      game.users = [user];
      game.players = [player1];

      mockGameRepository.findGameById.mockResolvedValue(game);
      mockPlayerRepository.findPlayerByItsPin.mockResolvedValue(player1);

      const error = await gameService.addPlayer(game.id, player1).catch(e => e);

      expect(error).toBeInstanceOf(BadRequest);
    });
  });
});
