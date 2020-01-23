import { RequestHandler, Response } from 'express-serve-static-core';
import { Container } from 'typedi';
import UserService from './users.service';
import AddUserRequest from './models/AddUserRequest.dto';
import User from './entities/users.entity';
import AuthenticatedUser from '../auth/AuthenticateUser';
import { rbacConfig } from '../auth/rbacConfig';

export const addUser: RequestHandler<never, User, AddUserRequest> = async (
  req,
  res,
): Promise<Response<User>> => {
  const userService = Container.get(UserService);
  const user = await userService.addUser(req.body);

  return res.json(user);
};

export const getUser: RequestHandler<{ id: string }, User, never> = async (
  req,
  res,
): Promise<Response<User>> => {
  const userService = Container.get(UserService);
  const user = await userService.getUser(req.params.id);

  return res.json(user);
};

export const authorizedToUpdateUser = AuthenticatedUser.of<
  { id: string },
  User
>(rbacConfig)
  .can('users::update')
  .when(async params => await Container.get(UserService).getUser(params.id))
  .done();

export default { addUser, getUser, authorizedToUpdateUser };
