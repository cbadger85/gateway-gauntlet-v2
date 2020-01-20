import { Role } from './Role';

export interface UserAuth {
  id: string;
  roles: Role[];
}
