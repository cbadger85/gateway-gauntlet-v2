import express from 'express';
import { getUser, addUser } from './users.handlers';
import { asyncHandler } from '../handlers/errorHandlers';
<<<<<<< HEAD
import { requestValidator } from '../utils/requestValidator';
import User from './entities/users.entity';

const userRoutes = express.Router();

userRoutes.post('/', requestValidator(User), asyncHandler(addUser));
=======

const userRoutes = express.Router();

userRoutes.post('/', asyncHandler(addUser));
>>>>>>> 7933dce725e745ce59aa56c53b797d2b11a06f2c

userRoutes.get('/:id', asyncHandler(getUser));

export default userRoutes;
