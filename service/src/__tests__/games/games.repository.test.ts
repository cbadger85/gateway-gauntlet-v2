import Player from '../../players/players.entity';
import GameRepository from '../../games/games.repository';
import Game from '../../games/games.entity';
import { getRepository } from 'typeorm';
import Container from 'typedi';
import User from '../../users/users.entity';
import { Role } from '../../auth/Role.model';

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

const user = new User();

user.username = 'foo';
user.password = 'bar';
user.roles = [Role.USER];
user.sessionId = '1234';
user.email = 'foo@example.com';
user.firstName = 'foo';
user.lastName = 'bar';

const game = new Game();
game.name = 'foo game';
game.users = [user];
game.players = [player1];
game.date = new Date(Date.now());
game.missions = ['mission 1', 'mission 2'];

describe('GameRepository', () => {
  let gameRepository: GameRepository;

  beforeEach(() => {
    Container.set(GameRepository, new GameRepository(getRepository(Game)));
    gameRepository = Container.get(GameRepository);
  });

  it('should save the game', async () => {
    const savedGame = await gameRepository.saveGame(game);

    expect(savedGame).toEqual(game);
  });

  it('should find all games', async () => {
    await gameRepository.saveGame(game);

    const games = await gameRepository.findAllGames();

    expect(games).toEqual([
      {
        id: expect.any(String),
        name: 'foo game',
        date: expect.any(Date),
        length: 1,
        missions: ['mission 1', 'mission 2'],
      },
    ]);
  });

  it('should find a game by id', async () => {
    const savedGame = await gameRepository.saveGame(game);
    const foundGame = await gameRepository.findGameById(savedGame.id);

    expect(foundGame).toEqual(savedGame);
  });

  it('should find a game by name', async () => {
    await gameRepository.saveGame(game);

    const fooGame = await gameRepository.findGameByName(game.name);

    expect(fooGame).toBeTruthy();
  });
});
