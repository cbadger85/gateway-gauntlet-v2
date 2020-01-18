import express from 'express';
import { getUser, addUser } from './users.handlers';
import { asyncHandler } from '../handlers/errorHandlers';
import { requestValidator } from '../utils/requestValidator';
import User from './entities/users.entity';

const userRoutes = express.Router();

userRoutes.post('/', requestValidator(User), asyncHandler(addUser));

userRoutes.get('/:id', asyncHandler(getUser));

export default userRoutes;
