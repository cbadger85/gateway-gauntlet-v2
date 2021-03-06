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
  updatePrice,
  updateDate,
  updateMissions,
  updateGameStatus,
} from './games.handlers';
import { authenticateUser } from '../auth/auth.handlers';
import AddPlayerRequest from './games.addPlayerRequest.dto';
import { uuidParamValidator } from '../handlers/uuidParamValidator';
import OrganizerRequest from './organizerRequest.dto';
import UpdatePriceRequest from './updatePriceRequest.dto';
import UpdateDateRequest from './updateDateRequest.dto';
import UpdateMissionsRequest from './updateMissionsRequest.dto';
import UpdateGameStatusRequest from './updateGameStatusRequest.dto';

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
  '/:gameId/price',
  asyncHandler(authenticateUser),
  requestValidator(UpdatePriceRequest),
  authorizedToUpdateGame,
  uuidParamValidator(),
  asyncHandler(updatePrice),
);

gameRoutes.put(
  '/:gameId/date',
  asyncHandler(authenticateUser),
  requestValidator(UpdateDateRequest),
  authorizedToUpdateGame,
  uuidParamValidator(),
  asyncHandler(updateDate),
);

gameRoutes.put(
  '/:gameId/missions',
  asyncHandler(authenticateUser),
  requestValidator(UpdateMissionsRequest),
  authorizedToUpdateGame,
  uuidParamValidator(),
  asyncHandler(updateMissions),
);

gameRoutes.post(
  '/:gameId/status',
  asyncHandler(authenticateUser),
  requestValidator(UpdateGameStatusRequest),
  authorizedToUpdateGame,
  uuidParamValidator(),
  asyncHandler(updateGameStatus),
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
