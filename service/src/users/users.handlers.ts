import { RequestHandler, Response } from 'express-serve-static-core';
import { Container } from 'typedi';
import UserService from './users.service';
import AddUserRequest from './models/AddUserRequest.dto';
import User from './entities/users.entity';

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

export default { addUser, getUser };
