import { RequestHandler } from 'express-serve-static-core';
import { Container } from 'typedi';
import AuthenticateUser from '../auth/AuthenticateUser';
import { rbacConfig } from '../auth/rbacConfig';
import User from './entities/users.entity';
import AddUserRequest from './models/AddUserRequest.dto';
import PasswordRequest from './models/PasswordRequest.dto';
import UserService from './users.service';

export const addUser: RequestHandler<never, User, AddUserRequest> = async (
  req,
  res,
) => {
  const userService = Container.get(UserService);

  const user = await userService.addUser(req.body);

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

export const authorizedToUpdateUser = AuthenticateUser.of<
  { id: string },
  User,
  User
>(rbacConfig)
  .can('users::update')
  .when(async params => await Container.get(UserService).getUser(params.id))
  .done();

export const authorizedToReadUser = AuthenticateUser.of<
  { id: string },
  User,
  User
>(rbacConfig)
  .can('users::read')
  .when(async params => await Container.get(UserService).getUser(params.id))
  .done();

export const authorizedToReadAllUsers = AuthenticateUser.of<never, never, User>(
  rbacConfig,
)
  .can('users::read')
  .done();

export const authorizedToCreateUser = AuthenticateUser.of<
  { id: string },
  User,
  User
>(rbacConfig)
  .can('users::create')
  .when(async params => await Container.get(UserService).getUser(params.id))
  .done();

export const authorizedToUpsertUserRole = AuthenticateUser.of(rbacConfig)
  .can('users::create-role')
  .done();
