import express from 'express';
import { getUser, addUser } from './users.handlers';
import { asyncHandler } from '../handlers/errorHandlers';
import { requestValidator } from '../handlers/requestValidator';
import AddUserRequest from './models/AddUserRequest.dto';
import HttpError from '../errors/HttpError';

const userRoutes = express.Router();

userRoutes.post('/', requestValidator(AddUserRequest), asyncHandler(addUser));

userRoutes.get('/:id', asyncHandler(getUser));

export default userRoutes;
