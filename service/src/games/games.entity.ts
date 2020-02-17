import { Exclude, Expose, Type } from 'class-transformer';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import Player from '../players/players.entity';
import User from '../users/users.entity';
import Organizer from './organizer.dto';

@Entity()
class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name!: string;

  @Column('simple-array')
  missions: string[];

  @Column()
  date: Date;

  @Column({ default: 1 })
  length: number;

  @ManyToMany(
    type => User,
    user => user.games,
    { cascade: true, eager: true },
  )
  @JoinTable()
  @Exclude({ toPlainOnly: true })
  users: User[];

  @OneToMany(
    type => Player,
    player => player.game,
    { cascade: true, eager: true },
  )
  @JoinTable()
  players: Player[];

  @Expose()
  @Type(() => Organizer)
  get organizers(): Organizer[] {
    const organizers = this.users.map(user => new Organizer(user));

    return organizers;
  }
}

export default Game;
