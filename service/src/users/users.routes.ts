import express from 'express';
import {
  getUser,
  addUser,
  authorizedToUpdateUser,
  disableAccount,
  resetPassword,
  requestResetPassword,
  changePassword,
  authorizedToCreateUser,
  authorizedToReadUser,
  getAllUsers,
  authorizedToUpsertUserRole,
} from './users.handlers';
import { asyncHandler } from '../handlers/errorHandlers';
import { requestValidator } from '../handlers/requestValidator';
import AddUserRequest from './models/AddUserRequest.dto';
import { verifyAuthorization } from '../auth/auth.handlers';
import PasswordRequest from './models/PasswordRequest.dto';
import RequestResetPasswordRequest from './models/RequestResetPasswordRequest.dto';

const userRoutes = express.Router();

userRoutes.post(
  '/',
  asyncHandler(verifyAuthorization),
  requestValidator(AddUserRequest),
  asyncHandler(authorizedToCreateUser),
  asyncHandler(authorizedToUpsertUserRole),
  asyncHandler(addUser),
);

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

userRoutes.put(
  '/:id/password',
  asyncHandler(verifyAuthorization),
  requestValidator(PasswordRequest),
  asyncHandler(authorizedToUpdateUser),
  asyncHandler(changePassword),
);

userRoutes.get(
  '/:id',
  asyncHandler(verifyAuthorization),
  asyncHandler(authorizedToReadUser),
  asyncHandler(getUser),
);

userRoutes.get(
  '/:id',
  asyncHandler(verifyAuthorization),
  asyncHandler(authorizedToReadUser),
  asyncHandler(getUser),
);

userRoutes.get(
  '/',
  asyncHandler(verifyAuthorization),
  asyncHandler(authorizedToReadUser),
  asyncHandler(getAllUsers),
);

export default userRoutes;
