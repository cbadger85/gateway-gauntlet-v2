import { PrimaryGeneratedColumn, Column, Entity, ManyToMany } from 'typeorm';
import { Role } from '../../auth/models/Role';
import { Exclude, Expose } from 'class-transformer';
import Game from '../../games/games.entity';
import crypto from 'crypto';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({ unique: true })
  username!: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true, type: 'date' })
  passwordExpiration?: Date | null;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  passwordResetId?: string;

  @Expose()
  @Column({ unique: true })
  email!: string;

  @Column('simple-array')
  roles!: Role[];

  @Column({ nullable: true })
  sessionId?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Expose()
  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @ManyToMany(
    type => Game,
    game => game.users,
  )
  games?: Game[];

  @Expose()
  get gravatar(): string {
    const hash = crypto
      .createHash('md5')
      .update(this.email.trim().toLowerCase())
      .digest('hex');

    return `https://www.gravatar.com/avatar/${hash}?s=200&d=retro`;
  }
}

export default User;
