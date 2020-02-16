import { Service } from 'typedi';
import UserRepository from '../users/users.repository';
import GameRepository from './games.repository';
import CreateGameRequest from './createGameRequest.dto';
import Game from './games.entity';
import { plainToClass, classToPlain } from 'class-transformer';
import Player from '../players/players.entity';
import NotFound from '../errors/NotFound';
import AddPlayerRequest from './games.addPlayerRequest.dto';
import shortid from 'shortid';
import PlayerRepository from '../players/players.repository';
import BadRequest from '../errors/BadRequest';

@Service()
class GameService {
  constructor(
    private gameRepository: GameRepository,
    private userRepository: UserRepository,
    private playerRepository: PlayerRepository,
  ) {}

  createGame = async (game: CreateGameRequest): Promise<Game> => {
    const existingGame = await this.gameRepository.findGameByName(game.name);

    if (existingGame) {
      throw new BadRequest('Game already exists');
    }

    const users = await this.userRepository.findUsersByIds(game.organizerIds);

    const savedGame = await this.gameRepository.saveGame(
      plainToClass(Game, {
        name: game.name,
        users,
      }),
    );

    return classToPlain(savedGame) as Game;
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

    const existingPlayer = await this.playerRepository.findPlayerByItsPin(
      newPlayer.itsPin,
    );

    const player = existingPlayer
      ? { ...existingPlayer, ...newPlayer }
      : newPlayer;

    const shortCode = shortid();

    game.players.push(plainToClass(Player, { ...player, shortCode }));

    const savedGame = await this.gameRepository.saveGame(game);

    return classToPlain(savedGame) as Game;
  };
}

export default GameService;
