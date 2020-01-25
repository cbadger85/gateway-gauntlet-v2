import express from 'express';
import {
  getUser,
  addUser,
  authorizedToUpdateUser,
  disableAccount,
  resetPassword,
  requestResetPassword,
  changePassword,
} from './users.handlers';
import { asyncHandler } from '../handlers/errorHandlers';
import { requestValidator } from '../handlers/requestValidator';
import AddUserRequest from './models/AddUserRequest.dto';
import { verifyAuthorization } from '../auth/auth.handlers';
import PasswordRequest from './models/PasswordRequest.dto';
import RequestResetPasswordRequest from './models/RequestResetPasswordRequest.dto';

const userRoutes = express.Router();

userRoutes.post('/', requestValidator(AddUserRequest), asyncHandler(addUser));

userRoutes.post(
  '/:id/disable',
  asyncHandler(verifyAuthorization),
  asyncHandler(authorizedToUpdateUser),
  asyncHandler(disableAccount),
);

userRoutes.post(
  '/:id/reset-password',
  requestValidator(PasswordRequest),
  asyncHandler(resetPassword),
);

userRoutes.post(
  '/:id/request-reset-password',
  requestValidator(RequestResetPasswordRequest),
  asyncHandler(requestResetPassword),
);

// TODO: add route to update user info

userRoutes.put(
  '/:id/password',
  asyncHandler(verifyAuthorization),
  asyncHandler(authorizedToUpdateUser),
  requestValidator(PasswordRequest),
  asyncHandler(changePassword),
);

userRoutes.get(
  '/:id',
  asyncHandler(verifyAuthorization),
  asyncHandler(authorizedToUpdateUser),
  asyncHandler(getUser),
);

export default userRoutes;
