import { RequestHandler } from 'express-serve-static-core';
import { Container } from 'typedi';
import AuthenticatedUser from '../auth/AuthenticateUser';
import { rbacConfig } from '../auth/rbacConfig';
import User from './entities/users.entity';
import AddUserRequest from './models/AddUserRequest.dto';
import RequestResetPasswordRequest from './models/RequestResetPasswordRequest.dto';
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

export const requestResetPassword: RequestHandler<
  never,
  void,
  RequestResetPasswordRequest
> = async (req, res) => {
  const userService = Container.get(UserService);
  await userService.requestResetPassword(req.body.email);

  return res.sendStatus(204);
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
  { id: string },
  void,
  PasswordRequest
> = async (req, res) => {
  const userService = Container.get(UserService);
  await userService.resetPassword(req.params.id, req.body.password);

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

export const changePassword: RequestHandler<
  { id: string },
  void,
  PasswordRequest
> = async (req, res) => {
  const userService = Container.get(UserService);
  await userService.changePassword(req.params.id, req.body.password);

  return res.sendStatus(204);
};

export const authorizedToUpdateUser = AuthenticatedUser.of<
  { id: string },
  User,
  User
>(rbacConfig)
  .can('users::update')
  .when(async params => await Container.get(UserService).getUser(params.id))
  .done();

export const authorizedToCreateUser = AuthenticatedUser.of<
  { id: string },
  User,
  User
>(rbacConfig)
  .can('users::create')
  .when(async params => await Container.get(UserService).getUser(params.id))
  .done();
