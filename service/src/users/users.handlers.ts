import { RequestHandler } from 'express-serve-static-core';
import { Container } from 'typedi';
import User from './users.entity';
import UserService from './users.service';

export const addUser: RequestHandler<never, User, User> = async (
  req,
  res,
): Promise<void> => {
  const { username, password } = req.body;
  const userService = Container.get(UserService);
  const user = await userService.addUser({ username, password });

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
