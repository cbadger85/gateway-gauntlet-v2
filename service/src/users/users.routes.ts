import express from 'express';
import { getUser, addUser } from './users.handlers';
import { asyncHandler } from '../handlers/errorHandlers';

const userRoutes = express.Router();

userRoutes.post('/', asyncHandler(addUser));

userRoutes.get('/:id', asyncHandler(getUser));

export default userRoutes;
