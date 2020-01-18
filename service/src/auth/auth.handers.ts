import { RequestHandler } from 'express-serve-static-core';
import User from '../users/entities/users.entity';
import LoginRequest from './models/LoginRequest.dto';
import Container from 'typedi';
import AuthService from './auth.service';

export const login: RequestHandler<never, User, LoginRequest> = async (
  req,
  res,
): Promise<void> => {
  const authService = Container.get(AuthService);
  const user = await authService.login(req.body);

  res.send(user);
};
