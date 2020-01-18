<<<<<<< HEAD
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { MaxLength, IsNotEmpty, MinLength } from 'class-validator';

@Entity()
class User {
  private constructor(username: string, password: string, roles: string) {
    this.username = username;
    this.password = password;
    this.roles = roles;
  }

=======
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
class User {
>>>>>>> 7933dce725e745ce59aa56c53b797d2b11a06f2c
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
