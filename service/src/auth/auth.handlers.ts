import { RequestHandler, Response } from 'express-serve-static-core';
import Container from 'typedi';
import User from '../users/entities/users.entity';
import AuthService from './auth.service';
import LoginRequest from './models/LoginRequest.dto';
import RequestResetPasswordRequest from './models/RequestResetPasswordRequest.dto';
import NotAuthorized from '../errors/NotAuthorized';

export const login: RequestHandler<never, User, LoginRequest> = async (
  req,
  res,
): Promise<Response<User>> => {
  const authService = Container.get(AuthService);
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res.cookie('access-token', accessToken, {
    expires: new Date(Date.now() + 600000),
    httpOnly: true,
  });

  res.cookie('refresh-token', refreshToken, {
    expires: new Date(Date.now() + 86400000),
    httpOnly: true,
  });

  return res.json(user);
};

export const logout: RequestHandler<never, void, never> = (
  req,
  res,
): Response<void> => {
  res.clearCookie('access-token');
  res.clearCookie('refresh-token');

  return res.sendStatus(204);
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

  const oldAccessToken = req.cookies['access-token'];
  const oldRefreshToken = req.cookies['refresh-token'];

  const { accessToken, refreshToken, user } = await authService.refresh(
    oldAccessToken,
    oldRefreshToken,
  );

  req.user = user;

  res.cookie('access-token', accessToken, {
    expires: new Date(Date.now() + 600000),
    httpOnly: true,
  });

  res.cookie('refresh-token', refreshToken, {
    expires: new Date(Date.now() + 86400000),
    httpOnly: true,
  });

  return next();
};
