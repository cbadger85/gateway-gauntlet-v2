import express from 'express';
import { requestValidator } from '../handlers/requestValidator';
import CreateGameRequest from './createGameRequest.dto';
import { asyncHandler } from '../handlers/errorHandlers';
import {
  createGame,
  addPlayer,
  authorizedToCreateGame,
  authorizedToAddPlayer,
  authorizedToReadGames,
  getGames,
  getGame,
  authorizedToUpdateGame,
  addOrganizer,
  removeOrganizer,
} from './games.handlers';
import { authenticateUser } from '../auth/auth.handlers';
import AddPlayerRequest from './games.addPlayerRequest.dto';
import { uuidParamValidator } from '../handlers/uuidParamValidator';
import OrganizerRequest from './organizerRequest.dto';

const gameRoutes = express.Router();

gameRoutes.get(
  '/',
  asyncHandler(authenticateUser),
  authorizedToReadGames,
  asyncHandler(getGames),
);

gameRoutes.get(
  '/:gameId',
  asyncHandler(authenticateUser),
  authorizedToReadGames,
  uuidParamValidator(),
  asyncHandler(getGame),
);

gameRoutes.post(
  '/',
  asyncHandler(authenticateUser),
  requestValidator(CreateGameRequest),
  authorizedToCreateGame,
  asyncHandler(createGame),
);

gameRoutes.put(
  '/:gameId/players',
  asyncHandler(authenticateUser),
  requestValidator(AddPlayerRequest),
  authorizedToAddPlayer,
  uuidParamValidator(),
  asyncHandler(addPlayer),
);

gameRoutes.put(
  '/:gameId/organizers',
  asyncHandler(authenticateUser),
  requestValidator(OrganizerRequest),
  authorizedToUpdateGame,
  uuidParamValidator(),
  asyncHandler(addOrganizer),
);

gameRoutes.delete(
  '/:gameId/organizers/:organizerId',
  asyncHandler(authenticateUser),
  authorizedToUpdateGame,
  uuidParamValidator(),
  asyncHandler(removeOrganizer),
);

export default gameRoutes;
