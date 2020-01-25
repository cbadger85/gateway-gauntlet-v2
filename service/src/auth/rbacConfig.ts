import { Role } from './models/Role';
import { RbacConfig } from './AuthenticateUser';

export const rbacConfig: RbacConfig = {
  [Role.USER]: {
    can: [
      {
        name: 'users::update',
        where: (userId, { id }) => id === userId,
      },
      {
        name: 'users::read',
        where: (userId, { id }) => id === userId,
      },
    ],
  },
  [Role.ADMIN]: {
    can: [
      'users::create',
      'users::read',
      {
        name: 'users::update',
        where: (_, { roles }) =>
          Array.isArray(roles) &&
          !(roles.includes(Role.ADMIN) || roles.includes(Role.SUPER_ADMIN)),
      },
    ],
    inherits: [Role.USER],
  },
  [Role.SUPER_ADMIN]: {
    can: ['users::update', 'users::create', 'users::delete'],
    inherits: [Role.ADMIN],
  },
};
