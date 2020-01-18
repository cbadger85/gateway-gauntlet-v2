import {
  MaxLength,
  IsNotEmpty,
  MinLength,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Role } from '../../auth/models/Role';

class User {
  private constructor(username: string, password: string, roles: string) {
    this.username = username;
    this.password = password;
    this.roles = roles;
  }

  @MaxLength(16)
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsArray()
  @IsEnum(Role, { each: true })
  roles: string;

  static of({ username, password, roles }: User): User {
    return new User(username, password, roles);
  }
}

export default User;
