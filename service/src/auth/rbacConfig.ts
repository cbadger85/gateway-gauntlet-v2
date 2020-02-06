import { Role } from './models/Role';
import { RbacConfig } from './AuthenticateUser';
import User from '../users/entities/users.entity';

const upsertRolePermissionsMap: { [key: string]: Role[] } = {
  [Role.SUPER_ADMIN]: [Role.ADMIN, Role.USER],
  [Role.ADMIN]: [Role.USER],
  [Role.USER]: [],
};

export const canUpsertRole = (
  user: User,
  params: {},
  body: { roles?: Role[] },
): boolean =>
  user.roles.some(userRole =>
    body.roles?.some(role => upsertRolePermissionsMap[userRole].includes(role)),
  );

export const isUsersId = (
  user: User,
  params?: Record<string, string>,
): boolean => user.id === params?.id;

export const canUpsertUser = (
  user: User,
  params?: Record<string, Role[] | undefined>,
): boolean =>
  !params?.roles?.includes(Role.ADMIN) &&
  !params?.roles?.includes(Role.SUPER_ADMIN);

export const rbacConfig: RbacConfig = {
  [Role.USER]: {
    can: [
      {
        name: 'users::update',
        where: isUsersId,
      },
      {
        name: 'users::read',
        where: isUsersId,
      },
    ],
  },
  [Role.ADMIN]: {
    can: [
      'users::create',
      'users::read',
      {
        name: 'users::update',
        where: canUpsertUser,
      },
      {
        name: 'users::create-role',
        where: canUpsertRole,
      },
      'game:delete',
      'player:delete',
    ],
    inherits: [Role.USER, Role.ORGANIZER],
  },
  [Role.SUPER_ADMIN]: {
    can: [
      'users::update',
      'users::create',
      'users::delete',
      {
        name: 'users::update-role',
        where: canUpsertRole,
      },
    ],
    inherits: [Role.ADMIN],
  },
  [Role.ORGANIZER]: {
    can: [
      'game::create',
      'game::read',
      'game::update',
      'game::addPlayer',
      'game::addOrganizer',
      'player::update',
    ],
  },
};
