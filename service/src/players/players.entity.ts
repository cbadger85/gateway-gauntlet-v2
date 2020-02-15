import { PrimaryGeneratedColumn, Column, Entity, ManyToMany } from 'typeorm';
import Game from '../games/games.entity';

@Entity()
class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name!: string;

  @Column()
  itsName: string;

  @Column({ unique: true })
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

  @ManyToMany(
    type => Game,
    game => game.players,
  )
  games?: Game[];

  @Column()
  shortCode: string;
}

export default Player;
