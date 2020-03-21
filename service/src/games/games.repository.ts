import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import Game from './games.entity';
import { Repository } from 'typeorm';

@Service()
class GameRepository {
  constructor(@InjectRepository(Game) private repository: Repository<Game>) {}

  findAllGames = (): Promise<Game[]> =>
    this.repository.find({
      select: ['id', 'name', 'date', 'length', 'missions'],
    });

  findGameById = (id: string): Promise<Game | undefined> =>
    this.repository.findOne(id);

  findGameByName = (name: string): Promise<Game | undefined> =>
    this.repository.findOne({ name });

  saveGame = (game: Game): Promise<Game> => this.repository.save(game);
}

export default GameRepository;
