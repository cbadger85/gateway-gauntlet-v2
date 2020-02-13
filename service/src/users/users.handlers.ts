import { RequestHandler } from 'express-serve-static-core';
import { Container } from 'typedi';
import { authorizeUser } from '../handlers/authorizeUser';
import { Role } from '../auth/Role.model';
import PasswordRequest from './PasswordRequest.dto';
import UpsertUserRequest from './UpsertUserRequest.dto';
import User from './users.entity';
import UserService from './users.service';

export const addUser: RequestHandler<never, User, UpsertUserRequest> = async (
  req,
  res,
) => {
  const userService = Container.get(UserService);

  const user = await userService.addUser(req.body);

  return res.json(user);
};

export const updateUser: RequestHandler<
  { id: string },
  User,
  UpsertUserRequest
> = async (req, res) => {
  const userService = Container.get(UserService);

  const user = await userService.updateUser(req.params.id, req.body);

  return res.json(user);
};

export const disableAccount: RequestHandler<
  { id: string },
  void,
  never
> = async (req, res) => {
  const userService = Container.get(UserService);
  await userService.disableAccount(req.params.id);

  return res.sendStatus(204);
};

export const resetPassword: RequestHandler<
  { id: string; passwordResetId: string },
  void,
  PasswordRequest
> = async (req, res) => {
  const userService = Container.get(UserService);
  await userService.resetForgottenPassword(
    req.params.id,
    req.params.passwordResetId,
    req.body.password,
  );

  return res.sendStatus(204);
};

export const getUser: RequestHandler<{ id: string }, User, never> = async (
  req,
  res,
) => {
  const userService = Container.get(UserService);
  const user = await userService.getUser(req.params.id);

  return res.json(user);
};

export const getAllUsers: RequestHandler<never, User[], never> = async (
  req,
  res,
) => {
  const userService = Container.get(UserService);
  const users = await userService.getAllUsers();

  return res.json(users);
};

export const changePassword: RequestHandler<
  { id: string },
  void,
  PasswordRequest
> = async (req, res) => {
  const userService = Container.get(UserService);
  await userService.changePassword(req.params.id, req.body.password);

  return res.sendStatus(204);
};

export const authorizedToUpdateUserPassword = authorizeUser<
  { id: string },
  void,
  PasswordRequest
>('users::updatePassword', (userRoles, req) => {
  return req.user?.id === req.params.id;
});

export const authorizedToUpdateUser = authorizeUser<
  { id: string },
  User,
  UpsertUserRequest
>('users::update', async (userRoles, req) => {
  const user = await Container.get(UserService).getUser(req.params.id);

  if (userRoles.includes(Role.SUPER_ADMIN)) {
    return true;
  }

  if (
    user.roles.includes(Role.ADMIN) ||
    user.roles.includes(Role.SUPER_ADMIN) ||
    req.body.roles.includes(Role.ADMIN) ||
    req.body.roles.includes(Role.SUPER_ADMIN)
  ) {
    return false;
  }

  return true;
});

export const authorizedToDisableUser = authorizeUser<
  { id: string },
  void,
  never
>('users::update', async (userRoles, req) => {
  const user = await Container.get(UserService).getUser(req.params.id);

  if (userRoles.includes(Role.SUPER_ADMIN)) {
    return true;
  }

  if (
    user.roles.includes(Role.ADMIN) ||
    user.roles.includes(Role.SUPER_ADMIN)
  ) {
    return false;
  }

  return true;
});

export const authorizedToReadUser = authorizeUser<{ id: string }, User, never>(
  'users::read',
  (userRoles, req) => {
    return req.user?.id === req.params.id || userRoles.includes(Role.ADMIN);
  },
);

export const authorizedToReadAllUsers = authorizeUser<never, User[], never>(
  'users::read',
  userRoles => userRoles.includes(Role.ADMIN),
);

export const authorizedToCreateUser = authorizeUser<
  { id: string },
  User,
  UpsertUserRequest
>('users::create', (userRoles, req) => {
  if (userRoles.includes(Role.SUPER_ADMIN)) {
    return true;
  }

  if (
    req.body.roles.includes(Role.ADMIN) ||
    req.body.roles.includes(Role.SUPER_ADMIN)
  ) {
    return false;
  }

  return true;
});
