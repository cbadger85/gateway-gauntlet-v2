import { Role } from './models/Role';
import { RbacConfig } from './AuthenticateUser';

export const rbacConfig: RbacConfig = {
  [Role.USER]: {
    can: [
      {
        name: 'users::update',
        where: ({ userId, id }) => {
          return id === userId;
        },
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
        where: ({ roles }) => {
          if (!Array.isArray(roles)) {
            return false;
          }

          return !roles.includes(Role.ADMIN);
        },
      },
    ],
    inherits: [Role.USER],
  },
  [Role.SUPER_ADMIN]: {
    can: ['users::update'],
    inherits: [Role.ADMIN],
  },
};
