import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { MaxLength, IsNotEmpty, MinLength } from 'class-validator';

@Entity()
class User {
  private constructor(username: string, password: string, roles: string) {
    this.username = username;
    this.password = password;
    this.roles = roles;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MaxLength(16)
  @IsNotEmpty()
  username!: string;

  @Column()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @Column()
  roles!: string;

  static of({ username, password, roles }: Omit<User, 'id'>): User {
    return new User(username, password, roles);
  }
}

export default User;
