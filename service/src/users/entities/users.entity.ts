import { PrimaryGeneratedColumn, Column, Entity, Generated } from 'typeorm';
import { Role } from '../../auth/models/Role';
import { Exclude } from 'class-transformer';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  username!: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password?: string;

  @Column({ nullable: false, unique: true })
  email!: string;

  @Column('simple-array', { nullable: false })
  roles!: Role[];

  @Exclude({ toPlainOnly: true })
  @Generated('uuid')
  @Column({ nullable: false })
  sessionId?: string;
}

export default User;
