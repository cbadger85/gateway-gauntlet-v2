import { RequestHandler } from 'express-serve-static-core';
import { Container } from 'typedi';
import UserService from './users.service';
import AddUserRequest from './models/AddUserRequest.dto';
import User from './entities/users.entity';

export const addUser: RequestHandler<never, User, AddUserRequest> = async (
  req,
  res,
): Promise<void> => {
  const { username, password, roles } = req.body;
  const userService = Container.get(UserService);
  const user = await userService.addUser({ username, password, roles });

  res.send(user);
};

export const getUser: RequestHandler<{ id: string }, User, never> = async (
  req,
  res,
) => {
  const userService = Container.get(UserService);

  const user = await userService.getUser(parseFloat(req.params.id));

  res.send(user);
};

export default { addUser, getUser };
