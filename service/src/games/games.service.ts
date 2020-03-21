import { classToPlain, plainToClass } from 'class-transformer';
import shortid from 'shortid';
import { Service } from 'typedi';
import BadRequest from '../errors/BadRequest';
import NotFound from '../errors/NotFound';
import Player from '../players/players.entity';
import UserRepository from '../users/users.repository';
import CreateGameRequest from './createGameRequest.dto';
import AddPlayerRequest from './games.addPlayerRequest.dto';
import Game from './games.entity';
import GameRepository from './games.repository';

@Service()
class GameService {
  constructor(
    private gameRepository: GameRepository,
    private userRepository: UserRepository,
  ) {}

  getGames = async (): Promise<Game[]> =>
    await this.gameRepository.findAllGames();

  createGame = async (game: CreateGameRequest): Promise<Game> => {
    const existingGame = await this.gameRepository.findGameByName(game.name);

    if (existingGame) {
      throw new BadRequest('Game already exists');
    }

    const { organizerIds, ...gameData } = game;

    const users = await this.userRepository.findUsersByIds(organizerIds);

    const savedGame = await this.gameRepository.saveGame(
      plainToClass(Game, {
        ...gameData,
        users,
      }),
    );

    return classToPlain(savedGame) as Game;
  };

  getGame = async (gameId: string): Promise<Game> => {
    const foundGame = await this.gameRepository.findGameById(gameId);

    if (!foundGame) {
      throw new NotFound('Tournament not found');
    }

    return classToPlain(foundGame) as Game;
  };

  addOrganizer = async (gameId: string, organizerId: string): Promise<Game> => {
    const game = await this.gameRepository.findGameById(gameId);

    if (!game) {
      throw new NotFound('Game cannot be found');
    }

    const user = await this.userRepository.findUser(organizerId);

    if (!user) {
      throw new NotFound('User cannot be found');
    }

    if (game.users.find(user => user.id === organizerId)) {
      throw new BadRequest('Organizer already added');
    }

    game.users.push(user);

    const savedGame = await this.gameRepository.saveGame(game);

    return classToPlain(savedGame) as Game;
  };

  removeOrganizer = async (
    gameId: string,
    organizerId: string,
  ): Promise<Game> => {
    const game = await this.gameRepository.findGameById(gameId);

    if (!game) {
      throw new NotFound('Game cannot be found');
    }

    const user = await this.userRepository.findUser(organizerId);

    if (!user) {
      throw new NotFound('User cannot be found');
    }

    if (game.organizers.length <= 1) {
      throw new BadRequest('Cannot have less than one organizer');
    }

    const updatedUsers = game.users.filter(user => user.id !== organizerId);

    game.users = updatedUsers;

    const savedGame = await this.gameRepository.saveGame(game);

    return classToPlain(savedGame) as Game;
  };

  addPlayer = async (
    gameId: string,
    newPlayer: AddPlayerRequest,
  ): Promise<Game> => {
    const game = await this.gameRepository.findGameById(gameId);

    if (!game) {
      throw new NotFound('Game does not exist');
    }

    if (game.players.find(player => player.itsPin === newPlayer.itsPin)) {
      throw new BadRequest('Player has already registered');
    }

    const shortCode = shortid();

    game.players.push(plainToClass(Player, { ...newPlayer, shortCode }));

    const savedGame = await this.gameRepository.saveGame(game);

    return classToPlain(savedGame) as Game;
  };

  updatePrice = async (gameId: string, price: number): Promise<Game> => {
    const game = await this.gameRepository.findGameById(gameId);

    if (!game) {
      throw new NotFound('Game does not exist');
    }

    game.price = price;

    const savedGame = await this.gameRepository.saveGame(game);

    return classToPlain(savedGame) as Game;
  };

  updateDate = async (
    gameId: string,
    date: Date,
    length?: number,
  ): Promise<Game> => {
    const game = await this.gameRepository.findGameById(gameId);

    if (!game) {
      throw new NotFound('Game does not exist');
    }

    game.date = date;
    game.length = length || 1;

    const savedGame = await this.gameRepository.saveGame(game);

    return classToPlain(savedGame) as Game;
  };
}

export default GameService;
