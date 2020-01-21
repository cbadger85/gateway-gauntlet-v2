import express from 'express';
import { asyncHandler } from '../handlers/errorHandlers';
import { requestValidator } from '../handlers/requestValidator';
import { login, logout } from './auth.handlers';
import LoginRequest from './models/LoginRequest.dto';

const authRoutes = express.Router();

authRoutes.post('/login', requestValidator(LoginRequest), asyncHandler(login));
authRoutes.post('/logout', logout);

export default authRoutes;
