import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Role } from '../auth/Role.model';

class UpsertUserRequest {
  @MaxLength(16)
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(24)
  email: string;

  @ArrayNotEmpty()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];

  @MaxLength(16)
  @IsNotEmpty()
  firstName: string;

  @MaxLength(16)
  @IsNotEmpty()
  lastName: string;
}

export default UpsertUserRequest;
