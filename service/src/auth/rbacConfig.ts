import { Role } from './models/Role';
import { RbacConfig } from './AuthenticateUser';

export const rbacConfig: RbacConfig = {
  [Role.USER]: {
    can: [
      {
        name: 'user::update',
        where: ({ userId, id }) => id === userId,
      },
    ],
  },
  [Role.ADMIN]: {
    can: [
      'user::create',
      'user::read',
      'user::delete',
      {
        name: 'user::update',
        where: ({ roles }) => {
          if (!Array.isArray(roles)) {
            return false;
          }

          return !roles.includes(Role.ADMIN);
        },
      },
    ],
  },
  [Role.SUPER_ADMIN]: {
    can: ['user::update'],
    inherits: [Role.ADMIN],
  },
};
