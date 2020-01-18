import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  username!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ nullable: false })
  roles!: string;
}

export default User;
