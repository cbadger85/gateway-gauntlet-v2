import express from 'express';
import { getUser, addUser } from './users.handlers';
import { asyncHandler } from '../handlers/errorHandlers';
import { requestValidator } from '../utils/requestValidator';
import AddUserValidator from './validators/AddUserValidator';

const userRoutes = express.Router();

userRoutes.post('/', requestValidator(AddUserValidator), asyncHandler(addUser));

userRoutes.get('/:id', asyncHandler(getUser));

export default userRoutes;
