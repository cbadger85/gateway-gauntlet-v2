import { Role } from './models/Role';

export const rbacConfig: RbacConfig = {
  [Role.USER]: {
    can: [
      {
        name: 'user::update',
        where: ({ userId, requestedUserId }) => requestedUserId === userId,
      },
    ],
  },
  [Role.ADMIN]: {
    can: ['user::create', 'user::read', 'user::update', 'user::delete'],
  },
};

export interface RbacConfig {
  [key: string]: {
    can: CanPermission[];
    inherits?: Role[];
  };
}

export type CanPermission =
  | string
  | {
      name: string;
      where: (params: Record<string, unknown>) => boolean;
    };
