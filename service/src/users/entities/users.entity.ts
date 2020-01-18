import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { Role } from '../../auth/models/Role';
import { Exclude } from 'class-transformer';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: false, unique: true })
  username!: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password?: string;

  @Column('simple-array', { nullable: false })
  roles!: Role[];
}

export default User;
