import express from 'express';
import { getUser, saveUser } from './users.controller';
import { asyncHandler } from '../handlers/errorHandlers';

const userRoutes = express.Router();

userRoutes.post('/', asyncHandler(saveUser));

userRoutes.get('/:id', asyncHandler(getUser));

export default userRoutes;
