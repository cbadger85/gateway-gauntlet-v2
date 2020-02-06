import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import Player from './players.entity';
import { Repository } from 'typeorm';

@Service()
class PlayerRepository {
  constructor(
    @InjectRepository(Player) private repository: Repository<Player>,
  ) {}

  findPlayerByItsPin = (itsPin: string): Promise<Player | undefined> =>
    this.repository.findOne({ where: { itsPin } });

  savePlayer = (player: Player): Promise<Player> =>
    this.repository.save(player);
}

export default PlayerRepository;
