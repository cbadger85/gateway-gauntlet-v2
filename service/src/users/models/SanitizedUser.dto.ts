import { Role } from '../../auth/models/Role';

export interface SantizedUserDto {
  id?: number;
  username: string;
  roles: Role[];
}
