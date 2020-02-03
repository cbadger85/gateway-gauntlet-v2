import { RequestHandler, Response } from 'express-serve-static-core';
import Container from 'typedi';
import User from '../users/entities/users.entity';
import AuthService from './auth.service';
import LoginRequest from './models/LoginRequest.dto';
import RequestResetPasswordRequest from './models/RequestResetPasswordRequest.dto';

export const login: RequestHandler<never, User, LoginRequest> = async (
  req,
  res,
): Promise<Response<User>> => {
  const authService = Container.get(AuthService);
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res.setHeader('x-access-token', accessToken);
  res.setHeader('x-refresh-token', refreshToken);

  return res.json(user);
};

export const requestResetPassword: RequestHandler<
  never,
  void,
  RequestResetPasswordRequest
> = async (req, res) => {
  const authService = Container.get(AuthService);
  await authService.requestResetPassword(req.body.email);

  return res.sendStatus(204);
};

export const getToken: RequestHandler<never, User, never> = async (
  req,
  res,
) => {
  res.json(req.user);
};

export const verifyAuthorization: RequestHandler<never, never, never> = async (
  req,
  res,
  next,
): Promise<void> => {
  const authService = Container.get(AuthService);

  const oldAccessToken = req.headers['x-access-token'];
  const oldRefreshToken = req.headers['x-refresh-token'];

  const { accessToken, refreshToken, user } = await authService.refresh(
    oldAccessToken as string,
    oldRefreshToken as string,
  );

  req.user = user;

  res.setHeader('x-access-token', accessToken);
  res.setHeader('x-refresh-token', refreshToken);

  return next();
};
