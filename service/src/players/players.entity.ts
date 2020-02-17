import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Game from '../games/games.entity';

@Entity()
class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name!: string;

  @Column()
  itsName: string;

  @Column()
  itsPin: string;

  @Column()
  email: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  paid: boolean;

  @Column()
  attending: boolean;

  @ManyToOne(
    type => Game,
    game => game.players,
  )
  game: Game;

  @Column()
  shortCode: string;
}

export default Player;
