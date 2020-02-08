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
  authorizedToUpsertUserRole,
  authorizedToReadAllUsers,
} from './users.handlers';
import { asyncHandler } from '../handlers/errorHandlers';
import { requestValidator } from '../handlers/requestValidator';
import AddUserRequest from './models/AddUserRequest.dto';
import { verifyAuthorization } from '../auth/auth.handlers';
import PasswordRequest from './models/PasswordRequest.dto';
import { uuidParamValidator } from '../handlers/uuidParamValidator';

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
  uuidParamValidator(),
  asyncHandler(authorizedToUpdateUser),
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
  asyncHandler(verifyAuthorization),
  requestValidator(PasswordRequest),
  uuidParamValidator(),
  asyncHandler(authorizedToUpdateUser),
  asyncHandler(changePassword),
);

userRoutes.get(
  '/:id',
  asyncHandler(verifyAuthorization),
  uuidParamValidator(),
  asyncHandler(authorizedToReadUser),
  asyncHandler(getUser),
);

userRoutes.get(
  '/:id',
  asyncHandler(verifyAuthorization),
  uuidParamValidator(),
  asyncHandler(authorizedToReadUser),
  asyncHandler(getUser),
);

userRoutes.get(
  '/',
  asyncHandler(verifyAuthorization),
  asyncHandler(authorizedToReadAllUsers),
  asyncHandler(getAllUsers),
);

export default userRoutes;
