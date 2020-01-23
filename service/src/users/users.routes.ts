import express from 'express';
import { getUser, addUser, authorizedToUdateUser } from './users.handlers';
import { asyncHandler } from '../handlers/errorHandlers';
import { requestValidator } from '../handlers/requestValidator';
import AddUserRequest from './models/AddUserRequest.dto';
import { verifyAuthorization } from '../auth/auth.handlers';

const userRoutes = express.Router();

userRoutes.post('/', requestValidator(AddUserRequest), asyncHandler(addUser));

userRoutes.get(
  '/:id',
  asyncHandler(verifyAuthorization),
  asyncHandler(authorizedToUdateUser),
  asyncHandler(getUser),
);

export default userRoutes;
