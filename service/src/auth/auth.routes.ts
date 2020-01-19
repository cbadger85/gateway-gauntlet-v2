import express from 'express';
import { asyncHandler } from '../handlers/errorHandlers';
import { login } from './auth.handers';
import { requestValidator } from '../handlers/requestValidator';
import LoginRequest from './models/LoginRequest.dto';

const authRoutes = express.Router();

authRoutes.post('/login', requestValidator(LoginRequest), asyncHandler(login));

export default authRoutes;
