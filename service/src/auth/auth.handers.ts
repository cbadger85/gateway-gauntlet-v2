import { RequestHandler, Response } from 'express-serve-static-core';
import User from '../users/entities/users.entity';
import LoginRequest from './models/LoginRequest.dto';
import Container from 'typedi';
import AuthService from './auth.service';

export const login: RequestHandler<never, User, LoginRequest> = async (
  req,
  res,
): Promise<Response<User>> => {
  const authService = Container.get(AuthService);
  const user = await authService.login(req.body);

  const token = authService.getAccessToken(user);
  const refreshToken = authService.getRefreshToken(user);

  res.cookie(token, 'access-token', {
    expires: new Date(Date.now() + 600000),
    httpOnly: true,
  });

  res.cookie(refreshToken, 'refresh-token', {
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

export const refresh: RequestHandler<never, User, never> = async (
  req,
  res,
  next,
): Promise<Response<User>> => {
  const authService = Container.get(AuthService);

  const refreshCookie = req.cookies['refresh-token'];

  const { id, sessionId } = authService.parseRefreshToken(refreshCookie);

  const user = await authService.refresh(id, sessionId);

  const token = authService.getAccessToken(user);
  const refreshToken = authService.getRefreshToken(user);

  res.cookie(token, 'access-token', {
    expires: new Date(Date.now() + 600000),
    httpOnly: true,
  });

  res.cookie(refreshToken, 'refresh-token', {
    expires: new Date(Date.now() + 86400000),
    httpOnly: true,
  });

  return res.json(user);
};
