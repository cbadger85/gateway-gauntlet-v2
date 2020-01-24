import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Role } from '../../auth/models/Role';

class AddUserRequest {
  @MaxLength(16)
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ArrayNotEmpty()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}

export default AddUserRequest;
