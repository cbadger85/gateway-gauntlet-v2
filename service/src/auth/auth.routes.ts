import express from 'express';
import { asyncHandler } from '../handlers/errorHandlers';
import { requestValidator } from '../handlers/requestValidator';
import {
  login,
  requestResetPassword,
  authenticateUser,
  getToken,
} from './auth.handlers';
import LoginRequest from './LoginRequest.dto';
import RequestResetPasswordRequest from './RequestResetPasswordRequest.dto';

const authRoutes = express.Router();

authRoutes.post('/login', requestValidator(LoginRequest), asyncHandler(login));

authRoutes.get('/token', asyncHandler(authenticateUser), getToken);

authRoutes.post(
  '/password/reset',
  requestValidator(RequestResetPasswordRequest),
  asyncHandler(requestResetPassword),
);

export default authRoutes;
