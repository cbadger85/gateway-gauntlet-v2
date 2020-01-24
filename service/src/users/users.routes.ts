import express from 'express';
import {
  getUser,
  addUser,
  authorizedToUpdateUser,
  disableAccount,
  resetPassword,
  requestResetPassword,
} from './users.handlers';
import { asyncHandler } from '../handlers/errorHandlers';
import { requestValidator } from '../handlers/requestValidator';
import AddUserRequest from './models/AddUserRequest.dto';
import { verifyAuthorization } from '../auth/auth.handlers';
import ResetPasswordRequest from './models/ResetPasswordRequest.dto';
import RequestResetPasswordRequest from './models/RequestResetPasswordRequest.dto';

const userRoutes = express.Router();

userRoutes.post('/', requestValidator(AddUserRequest), asyncHandler(addUser));

userRoutes.put(
  '/:id/disable', // TODO: POST??
  asyncHandler(verifyAuthorization),
  asyncHandler(authorizedToUpdateUser),
  asyncHandler(disableAccount),
);

userRoutes.put(
  '/:id/reset', // TODO: change to reset-password. POST??
  requestValidator(ResetPasswordRequest),
  asyncHandler(resetPassword),
);

userRoutes.put(
  '/:id/request-reset', // TODO: change to request-reset-password. POST??
  requestValidator(RequestResetPasswordRequest),
  asyncHandler(requestResetPassword),
);

// TODO: add route to update user info

// TODO: add route to change password when the user is authenticated

userRoutes.get(
  '/:id',
  asyncHandler(verifyAuthorization),
  asyncHandler(authorizedToUpdateUser),
  asyncHandler(getUser),
);

export default userRoutes;
