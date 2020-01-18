import {
  MaxLength,
  IsNotEmpty,
  MinLength,
  IsArray,
  IsEnum,
  Equals,
  ArrayNotEmpty,
} from 'class-validator';
import { Role } from '../../auth/models/Role';

class User {
  @MaxLength(16)
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  // @IsNotEmpty()
  // confirmPassword: string;

  @ArrayNotEmpty()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}

export default User;
