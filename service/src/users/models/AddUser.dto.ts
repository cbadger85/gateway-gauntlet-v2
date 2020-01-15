import { Role } from '../../auth/models/Role';

export interface AddUserDto {
  username: string;
  password: string;
  roles: Role[];
}
