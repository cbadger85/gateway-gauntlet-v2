import { Role } from '../auth/models/Role';

export const transformRolesToString = (roles: Role[]): string =>
  roles.join(',');

export const transformStringToRoles = (roles: string): Role[] =>
  roles.split(',') as Role[];
