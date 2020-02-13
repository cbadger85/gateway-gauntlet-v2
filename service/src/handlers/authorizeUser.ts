import {
  ParamsDictionary,
  Request,
  RequestHandler,
} from 'express-serve-static-core';
import Forbidden from '../errors/Forbidden';
import NotAuthorized from '../errors/NotAuthorized';
import { Role } from '../auth/Role.model';

export const rbacConfig: RbacConfig = {
  [Role.USER]: {
    can: ['users::updatePassword', 'users::read'],
  },
  [Role.ADMIN]: {
    can: ['users::create', 'users::update', 'game:delete', 'player:delete'],
    inherits: [Role.USER, Role.ORGANIZER],
  },
  [Role.SUPER_ADMIN]: {
    can: ['users::delete'],
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

export const flattenUserRoles = (roles: Role[]): Role[] => {
  return roles.reduce((acc, role) => {
    const inheritedRoles = rbacConfig[role].inherits;
    return inheritedRoles
      ? [role, ...flattenUserRoles(inheritedRoles)]
      : [role, ...acc];
  }, roles);
};

export const authorizeUser = <P extends ParamsDictionary, ResBody, ReqBody>(
  operation: string,
  callback?: ConditionFn<P, ResBody, ReqBody>,
): RequestHandler<P, ResBody, ReqBody> => async (req, res, next) => {
  if (!req.user) {
    return next(new NotAuthorized());
  }

  const inheritedUserRoles = [...new Set(flattenUserRoles(req.user.roles))];

  const canPerformOperation = inheritedUserRoles.some(role =>
    rbacConfig[role].can.includes(operation),
  );

  if (!canPerformOperation) {
    return next(new Forbidden());
  }

  if (!callback) {
    return next();
  }

  return (await callback(inheritedUserRoles, req))
    ? next()
    : next(new Forbidden());
};

type RbacConfig = Record<Role, Rbac>;

type Rbac = {
  can: string[];
  inherits?: Role[];
};

type ConditionFn<P extends ParamsDictionary, ResBody, ReqBody> = (
  userRoles: Role[],
  req: Request<P, ResBody, ReqBody>,
) => boolean | Promise<boolean>;
