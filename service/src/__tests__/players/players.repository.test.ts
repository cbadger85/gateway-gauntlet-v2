import { Container } from 'typedi';
import { getRepository } from 'typeorm';
import Player from '../../players/players.entity';
import PlayerRepository from '../../players/players.repository';

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

describe('UserRepository', () => {
  let playerRepository: PlayerRepository;

  beforeEach(() => {
    Container.set(
      PlayerRepository,
      new PlayerRepository(getRepository(Player)),
    );
    playerRepository = Container.get(PlayerRepository);
  });

  it('should save a player', async () => {
    const player = await playerRepository.savePlayer(player1);

    expect(player).toEqual({ id: expect.any(String), ...player1 });
  });

  it('should find a player by its pin', async () => {
    const savedPlayer = await playerRepository.savePlayer(player1);

    const player = await playerRepository.findPlayerByItsPin('abcdef');

    expect(player).toEqual(savedPlayer);
  });
});
