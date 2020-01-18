import { Role } from '../../auth/models/Role';

export interface UserResponse {
  id?: number;
  username: string;
  roles: Role[];
}
