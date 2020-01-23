import { Role } from './models/Role';
import { RbacConfig } from './AuthenticateUser';

export const rbacConfig: RbacConfig = {
  [Role.USER]: {
    can: [
      {
        name: 'users::update',
        where: (userId, { id }) => id === userId,
      },
    ],
  },
  [Role.ADMIN]: {
    can: [
      'users::create',
      'users::read',
      'users::delete',
      {
        name: 'users::update',
        where: (_, { roles }) =>
          Array.isArray(roles) && roles.includes(Role.USER),
      },
    ],
    inherits: [Role.USER],
  },
  [Role.SUPER_ADMIN]: {
    can: ['users::update'],
    inherits: [Role.ADMIN],
  },
};
