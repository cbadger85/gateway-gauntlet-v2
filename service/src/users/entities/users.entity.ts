import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { Role } from '../../auth/models/Role';
import { Exclude } from 'class-transformer';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username!: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  passwordExpiration: Date;

  @Column({ unique: true })
  email!: string;

  @Column('simple-array')
  roles!: Role[];

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  sessionId?: string;
}

export default User;
