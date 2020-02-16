import express from 'express';
import { asyncHandler } from '../handlers/errorHandlers';
import { authenticateUser } from '../auth/auth.handlers';
import { authorizedToCreateGame } from '../games/games.handlers';
import { getOrganizers } from './organizers.handlers';

const organizerRoutes = express.Router();

organizerRoutes.get(
  '/',
  asyncHandler(authenticateUser),
  authorizedToCreateGame,
  asyncHandler(getOrganizers),
);

export default organizerRoutes;
