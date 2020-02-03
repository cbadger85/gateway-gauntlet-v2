import express from 'express';
import { asyncHandler } from '../handlers/errorHandlers';
import { requestValidator } from '../handlers/requestValidator';
import {
  login,
  requestResetPassword,
  verifyAuthorization,
  getToken,
} from './auth.handlers';
import LoginRequest from './models/LoginRequest.dto';
import RequestResetPasswordRequest from './models/RequestResetPasswordRequest.dto';

const authRoutes = express.Router();

authRoutes.post('/login', requestValidator(LoginRequest), asyncHandler(login));

authRoutes.get('/token', asyncHandler(verifyAuthorization), getToken);

authRoutes.post(
  '/password/reset',
  requestValidator(RequestResetPasswordRequest),
  asyncHandler(requestResetPassword),
);

export default authRoutes;
