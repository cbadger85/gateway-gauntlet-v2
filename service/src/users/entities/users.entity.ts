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

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  passwordResetId?: string;

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
}

export default User;
