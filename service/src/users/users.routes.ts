import express from 'express';
import {
  getUser,
  addUser,
  authorizedToUpdateUser,
  disableAccount,
  resetPassword,
  changePassword,
  authorizedToCreateUser,
  authorizedToReadUser,
  getAllUsers,
  authorizedToReadAllUsers,
  updateUser,
  authorizedToUpdateUserPassword,
  authorizedToDisableUser,
} from './users.handlers';
import { asyncHandler } from '../handlers/errorHandlers';
import { requestValidator } from '../handlers/requestValidator';
import UpsertUserRequest from './UpsertUserRequest.dto';
import { authenticateUser } from '../auth/auth.handlers';
import PasswordRequest from './PasswordRequest.dto';
import { uuidParamValidator } from '../handlers/uuidParamValidator';

const userRoutes = express.Router();

userRoutes.post(
  '/',
  asyncHandler(authenticateUser),
  requestValidator(UpsertUserRequest),
  authorizedToCreateUser,
  asyncHandler(addUser),
);

userRoutes.put(
  '/:id',
  asyncHandler(authenticateUser),
  requestValidator(UpsertUserRequest),
  uuidParamValidator(),
  asyncHandler(authorizedToUpdateUser),
  asyncHandler(updateUser),
);

userRoutes.post(
  '/:id/disable',
  asyncHandler(authenticateUser),
  uuidParamValidator(),
  asyncHandler(authorizedToDisableUser),
  asyncHandler(disableAccount),
);

userRoutes.post(
  '/:id/password/:passwordResetId/reset',
  requestValidator(PasswordRequest),
  uuidParamValidator({ whitelist: ['passwordResetId'] }),
  asyncHandler(resetPassword),
);

userRoutes.put(
  '/:id/password',
  asyncHandler(authenticateUser),
  requestValidator(PasswordRequest),
  uuidParamValidator(),
  asyncHandler(authorizedToUpdateUserPassword),
  asyncHandler(changePassword),
);

userRoutes.get(
  '/:id',
  asyncHandler(authenticateUser),
  uuidParamValidator(),
  asyncHandler(authorizedToReadUser),
  asyncHandler(getUser),
);

userRoutes.get(
  '/',
  asyncHandler(authenticateUser),
  authorizedToReadAllUsers,
  asyncHandler(getAllUsers),
);

export default userRoutes;
